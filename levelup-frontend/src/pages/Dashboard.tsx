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
import { careerPath, certifications, currentUser, dashboardStats } from '../data/mock'
import { useLanguage } from '../i18n/LanguageContext'

export default function Dashboard() {
  const { t } = useLanguage()
  const stats = [...dashboardStats]
  const currentLevel = careerPath.find((l) => l.status === 'current')!
  const currentIndex = careerPath.findIndex((l) => l.id === currentLevel.id)
  const nextLevel = careerPath[currentIndex + 1]
  const completedCerts = certifications.filter((c) => c.status === 'completed').length

  return (
    <div>
      <PageHead
        title={t('dashboard.greeting', { name: currentUser.name.split(' ')[0] })}
        subtitle={t('dashboard.subtitle')}
        actions={
          <Button variant="secondary">
            <Icon name="plus" size={16} />
            {t('common.logActivity')}
          </Button>
        }
      />

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
      <div className="grid grid-2 mb-16">
        <StatCard icon={stats[0].icon} label={stats[0].label} value={stats[0].value} detail={stats[0].detail} tone={stats[0].tone} />
        <StatCard icon={stats[1].icon} label={stats[1].label} value={stats[1].value} detail={stats[1].detail} tone={stats[1].tone} />
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
    </div>
  )
}
