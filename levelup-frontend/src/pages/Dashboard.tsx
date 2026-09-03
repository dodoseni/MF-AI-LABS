import {
  ApiNotice,
  Button,
  Card,
  CardHead,
  Icon,
  LevelRoadmap,
  PageHead,
  ProgressBar,
  StatCard,
} from '../components/ui'
import { useCertifications } from '../context/CertificationsContext'
import { useProfile } from '../context/ProfileContext'
import { useLanguage } from '../i18n/LanguageContext'

export default function Dashboard() {
  const { t } = useLanguage()
  const { profile } = useProfile()
  const { careerPath, careerLevelsStatus, refetchCareerLevels } = useCertifications()
  const currentLevel = careerPath.find((l) => l.status === 'current')!
  const currentIndex = careerPath.findIndex((l) => l.id === currentLevel.id)
  const nextLevel = careerPath[currentIndex + 1]
  const levelMet = currentLevel.requirements.filter((r) => r.met).length
  const levelTarget = currentLevel.chooseAtLeast ?? currentLevel.requirements.length
  const levelRemaining = Math.max(0, levelTarget - levelMet)

  return (
    <div>
      <PageHead
        title={t('dashboard.greeting', { name: profile.name.split(' ')[0] })}
        subtitle={t('dashboard.subtitle')}
        actions={
          <Button variant="secondary">
            <Icon name="plus" size={16} />
            {t('common.logActivity')}
          </Button>
        }
      />

      {(careerLevelsStatus === 'loading' || careerLevelsStatus === 'error') && (
        <ApiNotice
          status={careerLevelsStatus}
          loadingText={t('common.loadingCareerLevels')}
          errorText={t('common.errorCareerLevels')}
          onRetry={careerLevelsStatus === 'error' ? refetchCareerLevels : undefined}
          retryLabel={t('common.retry')}
        />
      )}

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
                met: currentLevel.requirements.filter((r) => r.met).length,
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
      <div className="grid grid-2">
        <StatCard icon="level" label={t('dashboard.stat.currentLevel')} value={currentLevel.name} tone="brand" />
        <StatCard
          icon="cert"
          label={t('dashboard.stat.levelCertifications')}
          value={`${levelMet} / ${levelTarget}`}
          detail={
            levelRemaining > 0
              ? t('dashboard.stat.moreToReach', { count: levelRemaining, level: nextLevel?.name ?? '' })
              : t('dashboard.stat.requirementsMet')
          }
          tone="success"
        />
      </div>
    </div>
  )
}
