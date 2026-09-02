import {
  Button,
  Card,
  CardHead,
  Icon,
  LevelRoadmap,
  PageHead,
  ProgressBar,
  StatCard,
} from '../components/ui'
import { ApiState } from '../components/ApiState'
import { useProfile } from '../api/ProfileContext'
import { fetchCareerLevels } from '../api/careerLevels'
import { fetchCertifications } from '../api/certifications'
import { useApiResource } from '../api/useApiResource'
import { useLanguage } from '../i18n/LanguageContext'
import type { CareerLevel, Certification, Profile } from '../types'

export default function Dashboard() {
  const { t } = useLanguage()

  // Profile is fetched once for the whole app (see `ProfileProvider`,
  // consumed here and by `Sidebar` / `Profile.tsx`) rather than re-fetched
  // per page.
  const profileRes = useProfile()
  const careerLevelsRes = useApiResource(fetchCareerLevels)
  const certificationsRes = useApiResource(fetchCertifications)

  const loading = profileRes.loading || careerLevelsRes.loading || certificationsRes.loading
  const error = profileRes.error ?? careerLevelsRes.error ?? certificationsRes.error
  const retryAll = () => {
    profileRes.retry()
    careerLevelsRes.retry()
    certificationsRes.retry()
  }

  const profile = profileRes.data
  const careerPath = careerLevelsRes.data
  const certifications = certificationsRes.data

  return (
    <div>
      <PageHead
        title={t('dashboard.greeting', { name: profile ? profile.name.split(' ')[0] : '…' })}
        subtitle={t('dashboard.subtitle')}
        actions={
          <Button variant="secondary">
            <Icon name="plus" size={16} />
            {t('common.logActivity')}
          </Button>
        }
      />

      <ApiState loading={loading} error={error} onRetry={retryAll}>
        {profile && careerPath && certifications && (
          <DashboardContent profile={profile} careerPath={careerPath} certifications={certifications} />
        )}
      </ApiState>
    </div>
  )
}

function DashboardContent({
  profile,
  careerPath,
  certifications,
}: {
  profile: Profile
  careerPath: CareerLevel[]
  certifications: Certification[]
}) {
  const { t } = useLanguage()
  const currentLevel = careerPath.find((l) => l.status === 'current') ?? careerPath[0]
  const currentIndex = careerPath.findIndex((l) => l.id === currentLevel.id)
  const nextLevel = careerPath[currentIndex + 1]
  const completedCerts = certifications.filter((c) => c.status === 'completed').length
  const metRequirements = currentLevel.requirements.filter((r) => r.met).length

  return (
    <>
      {/* Hero / current level */}
      <div className="mb-16">
        <div className="next-level-card">
          <div className="next-label">{t('dashboard.progressToNext')}</div>
          <div className="next-title">
            {currentLevel.name} → {nextLevel?.name ?? '—'}
          </div>
          <ProgressBar value={currentLevel.progress} />
          <div className="next-meta">
            <span>{t('career.percentComplete', { value: currentLevel.progress })}</span>
            <span>
              {t('dashboard.requirementsMet', {
                met: metRequirements,
                total: currentLevel.requirements.length,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Level roadmap overview */}
      <Card className="mb-16">
        <CardHead
          title={t('career.roadmap')}
          icon="level"
          link="/career"
          linkLabel={t('dashboard.careerPathLink')}
        />
        <div style={{ padding: '4px 20px 20px' }}>
          <LevelRoadmap levels={careerPath} selectedId={currentLevel.id} />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-2 mb-16">
        <StatCard
          icon="level"
          label={t('profile.currentLevel')}
          value={profile.level}
          detail={`${t('dashboard.progressToNext')}: ${profile.nextLevel}`}
          tone="brand"
        />
        <StatCard
          icon="cert"
          label={t('dashboard.certificationProgress')}
          value={`${metRequirements} / ${currentLevel.requirements.length}`}
          detail={currentLevel.requirementNote}
          tone="success"
        />
      </div>

      <Card>
        <CardHead title={t('dashboard.certificationProgress')} icon="cert" link="/certifications" linkLabel={t('dashboard.allLink')} />
        <div style={{ padding: '8px 20px 20px' }}>
          <ProgressBar value={Math.round((completedCerts / certifications.length) * 100)} />
          <div className="progress-label" style={{ marginTop: 8 }}>
            <span>{t('dashboard.completed', { done: completedCerts, total: certifications.length })}</span>
            <span className="val">{Math.round((completedCerts / certifications.length) * 100)}%</span>
          </div>
        </div>
      </Card>
    </>
  )
}
