import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { careerPath as careerPathTemplate, certifications as initialCertifications } from '../data/mock'
import type { CareerLevel, Certification, CertificationStatus, Requirement } from '../types'

interface NewCertificationInput {
  name: string
  issuer: string
  category: string
}

interface CertificationsContextValue {
  /** The single source of truth for certifications across Dashboard, Career Path and Certifications. */
  certifications: Certification[]
  /** Career levels with `requirements[].met`, `requirements[].detail` and `progress` recomputed
   *  live from `certifications` — adding/removing a certification updates this automatically. */
  careerPath: CareerLevel[]
  addCertification: (input: NewCertificationInput) => void
  deleteCertification: (id: string) => void
  updateCertificationStatus: (id: string, status: CertificationStatus) => void
}

const CertificationsContext = createContext<CertificationsContextValue | null>(null)

function requirementDetail(cert: Certification | undefined): string {
  if (!cert) return 'Not started'
  if (cert.status === 'completed') return 'Completed'
  if (cert.status === 'in-progress') return `In progress — ${cert.progress ?? 0}%`
  return 'Not started'
}

/** Recomputes each level's requirement checklist + progress % from the live certifications list. */
function deriveCareerPath(certifications: Certification[]): CareerLevel[] {
  const byId = new Map(certifications.map((c) => [c.id, c]))

  return careerPathTemplate.map((level) => {
    if (level.requirementMode === 'holistic') return level

    const requirements: Requirement[] = level.requirements.map((req) => {
      const cert = req.certId ? byId.get(req.certId) : undefined
      const met = cert?.status === 'completed'
      return { ...req, met, detail: requirementDetail(cert) }
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
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications)

  const careerPath = useMemo(() => deriveCareerPath(certifications), [certifications])

  function addCertification(input: NewCertificationInput) {
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
    setCertifications((prev) => prev.filter((c) => c.id !== id))
  }

  function updateCertificationStatus(id: string, status: CertificationStatus) {
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
    () => ({ certifications, careerPath, addCertification, deleteCertification, updateCertificationStatus }),
    [certifications, careerPath],
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
