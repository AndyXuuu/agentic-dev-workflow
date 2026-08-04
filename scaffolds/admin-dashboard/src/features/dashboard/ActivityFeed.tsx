import { activities } from './dashboard.data'

const tones = {
  success: 'bg-success',
  error: 'bg-error',
  info: 'bg-info',
  warning: 'bg-warning',
  neutral: 'bg-neutral',
}

export function ActivityFeed() {
  return (
    <div className="p-5">
      <ul className="space-y-0">
        {activities.map((activity, index) => (
          <li className="relative grid grid-cols-[1.75rem_1fr] gap-3 pb-5 last:pb-0" key={activity.title}>
            {index < activities.length - 1 && <span className="absolute left-[0.85rem] top-7 h-[calc(100%-1.4rem)] w-px bg-base-300" />}
            <span className={`relative mt-1 size-3.5 rounded-full border-[3px] border-base-100 ${tones[activity.tone]}`} />
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold">{activity.title}</p>
                <time className="text-xs text-base-content/42">{activity.time}</time>
              </div>
              <p className="mt-1 text-sm leading-5 text-base-content/55">{activity.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
