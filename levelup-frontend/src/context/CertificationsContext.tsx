import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { careerPath as careerPathFallback, certifications as certificationsFallback } from '../data/mock'
import { getCertifications } from '../api/certifications'
import { getCareerLevels } from '../api/careerLevels'
import type { CareerLevel, Certification, CertificationStatus, Requirement } from '../types'

export type ResourceStatus = 'loading' | 'success' | 'error'

interface NewCertificationInput {
  name: string
  issuer: string
  category: string
}

interface CertificationsContextValue {
  /** The single source of truth for certifications across Dashboard, Career Path and
   *  Certifications. Seeded from `GET /api/certifications`; falls back to local mock data
   *  while loading or if the request fails so the app is never blank. */
  certifications: Certification[]
  certificationsStatus: ResourceStatus
  /** Re-run the GET /api/certifications request (e.g. from a "Retry" button after an error). */
  refetchCertifications: () => void

  /** Career levels with `requirements[].met`, `requirements[].detail` and `progress` recomputed
   *  live from `certifications` — adding/removing a certification updates this automatically.
   *  The underlying level data (name, description, requirement list, etc.) is seeded from
   *  `GET /api/career-levels`, with the same mock-data fallback behaviour as certifications. */
  careerPath: CareerLevel[]
  careerLevelsStatus: ResourceStatus
  /** Re-run the GET /api/career-levels request (e.g. from a "Retry" button after an error). */
  refetchCareerLevels: () => void

  addCertification: (input: NewCertificationInput) => void
  deleteCertification: (id: string) => void
  updateCertificationStatus: (id: string, status: CertificationStatus) => void
}

const CertificationsContext = createContext<CertificationsContextValue | null>(null)

/**
 * `GET /api/career-levels` requirements do not include a `certId` linking a requirement to a
 * `Certification.id` (unlike the frontend's own `data/mock.ts` template, which has always
 * carried this field). Until the backend contract adds it, this static map bridges that gap
 * using the exact requirement label text — which the backend mock data mirrors field-for-field
 * from the frontend — so live progress/met-state can still be derived from `certifications`.
 * Requirements with no matching entry here simply keep the backend's static `met`/`detail`
 * values instead of being incorrectly forced to "not met".
 */
const REQUIREMENT_CERT_LINKS: Record<string, string> = {
  'AZ-104 — Azure Administrator Associate': 'az-104',
  'SC-300 — Identity and Access Administrator Associate': 'sc-300',
  'Terraform Associate — HashiCorp Certified: Terraform Associate': 'terraform-associate',
  'Sopra Steria Navigator Foundation': 'navigator-foundation',

  'AI-103 — Azure AI App and Agent Developer Associate': 'ai-103',
  'AZ-800 — Windows Server Hybrid Administrator Associate': 'az-800',
  'AI-200 — Azure AI Cloud Developer Associate': 'ai-200',
  'AZ-700 — Azure Network Engineer Associate': 'az-700',
  'SC-401 — Information Security Administrator Associate': 'sc-401',
  'SC-200 — Security Operations Analyst Associate': 'sc-200',
  'SC-500 — Cloud and AI Security Engineer Associate': 'sc-500',
  'CKS — Certified Kubernetes Security Specialist': 'cks',
  'CKA — Certified Kubernetes Administrator': 'cka',
  'Terraform Authoring and Operations Professional': 'terraform-professional',
  'GH-500 — GitHub Advanced Security': 'gh-500',
  'GH-200 — GitHub Actions': 'gh-200',
  'GH-300 — GitHub Copilot': 'gh-300',

  'AZ-305 — Azure Solutions Architect Expert': 'az-305',
  'AZ-400 — DevOps Engineer Expert': 'az-400',
  'SC-100 — Cybersecurity Architect Expert': 'sc-100',
  'AB-100 — Agentic AI Business Solutions Architect': 'ab-100',
  'MS-102 — Microsoft 365 Administrator Expert': 'ms-102',
  'SC-730 — Cybersecurity Business Professional': 'sc-730',
}

function requirementDetail(cert: Certification | undefined): string {
  if (!cert) return 'Not started'
  if (cert.status === 'completed') return 'Completed'
  if (cert.status === 'in-progress') return `In progress — ${cert.progress ?? 0}%`
  return 'Not started'
}

/** Recomputes each level's requirement checklist + progress % from the live certifications list. */
function deriveCareerPath(base: CareerLevel[], certifications: Certification[]): CareerLevel[] {
  const byId = new Map(certifications.map((c) => [c.id, c]))

  return base.map((level) => {
    if (level.requirementMode === 'holistic') return level

    const requirements: Requirement[] = level.requirements.map((req) => {
      const certId = req.certId ?? REQUIREMENT_CERT_LINKS[req.label]
      if (!certId) return req
      const cert = byId.get(certId)
      return { ...req, certId, met: cert?.status === 'completed', detail: requirementDetail(cert) }
    })

    const metCount = requirements.filter((r) => r.met).length
    let progress: number

    if (level.requirementMode === 'all') {
      progress = requirements.length ? Math.round((metCount / requirements.length) * 100) : 0
    } else {
      const target = level.chooseAtLeast ?? (requirements.length || 1)
      const creditSum = requirements.reduce((sum, req) => {
        const cert = req.certId ? byId.get(req.certId) : undefined
        if (!cert) return sum
        if (cert.status === 'completed') return sum + 1
        if (cert.status === 'in-progress') return sum + (cert.progress ?? 0) / 100
        return sum
      }, 0)
      progress = Math.round(Math.min(1, creditSum / target) * 100)
    }

    return { ...level, requirements, progress }
  })
}

export function CertificationsProvider({ children }: { children: ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>(certificationsFallback)
  const [certificationsStatus, setCertificationsStatus] = useState<ResourceStatus>('loading')
  const [certReloadKey, setCertReloadKey] = useState(0)
  // Once the user has made a local edit, an in-flight/late API response must never clobber it.
  const certEditedRef = useRef(false)

  const [careerLevelsBase, setCareerLevelsBase] = useState<CareerLevel[]>(careerPathFallback)
  const [careerLevelsStatus, setCareerLevelsStatus] = useState<ResourceStatus>('loading')
  const [levelsReloadKey, setLevelsReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setCertificationsStatus('loading')

    getCertifications(controller.signal)
      .then((data) => {
        if (!certEditedRef.current) setCertifications(data)
        setCertificationsStatus('success')
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Failed to load certifications from the API; showing fallback data.', err)
        setCertificationsStatus('error')
      })

    return () => controller.abort()
  }, [certReloadKey])

  useEffect(() => {
    const controller = new AbortController()
    setCareerLevelsStatus('loading')

    getCareerLevels(controller.signal)
      .then((data) => {
        setCareerLevelsBase(data)
        setCareerLevelsStatus('success')
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Failed to load career levels from the API; showing fallback data.', err)
        setCareerLevelsStatus('error')
      })

    return () => controller.abort()
  }, [levelsReloadKey])

  const careerPath = useMemo(
    () => deriveCareerPath(careerLevelsBase, certifications),
    [careerLevelsBase, certifications],
  )

  function addCertification(input: NewCertificationInput) {
    certEditedRef.current = true
    const slug = input.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const newCert: Certification = {
      id: `${slug}-${Date.now()}`,
      name: input.name.trim(),
      issuer: input.issuer.trim() || 'Custom',
      status: 'in-progress',
      category: input.category,
      level: 'Associate',
      progress: 0,
      requiredFor: [],
      description: 'Manually added certification.',
    }
    setCertifications((prev) => [newCert, ...prev])
  }

  function deleteCertification(id: string) {
    certEditedRef.current = true
    setCertifications((prev) => prev.filter((c) => c.id !== id))
  }

  function updateCertificationStatus(id: string, status: CertificationStatus) {
    certEditedRef.current = true
    setCertifications((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              progress: status === 'in-progress' ? c.progress ?? 10 : c.progress,
              earnedDate:
                status === 'completed'
                  ? c.earnedDate ?? new Date().toISOString().slice(0, 10)
                  : c.earnedDate,
            }
          : c,
      ),
    )
  }

  const value = useMemo(
    () => ({
      certifications,
      certificationsStatus,
      refetchCertifications: () => setCertReloadKey((k) => k + 1),
      careerPath,
      careerLevelsStatus,
      refetchCareerLevels: () => setLevelsReloadKey((k) => k + 1),
      addCertification,
      deleteCertification,
      updateCertificationStatus,
    }),
    [certifications, certificationsStatus, careerPath, careerLevelsStatus],
  )

  return <CertificationsContext.Provider value={value}>{children}</CertificationsContext.Provider>
}

export function useCertifications() {
  const ctx = useContext(CertificationsContext)
  if (!ctx) {
    throw new Error('useCertifications must be used within a CertificationsProvider')
  }
  return ctx
}
