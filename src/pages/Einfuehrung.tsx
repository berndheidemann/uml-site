import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { einfuehrungContent } from '../data/content/einfuehrung.ts'

export default function Einfuehrung() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-2">{einfuehrungContent.title}</h1>
      <p className="text-text-light mb-8">{einfuehrungContent.introduction}</p>
      <TheorySectionComponent sections={einfuehrungContent.sections} />
    </div>
  )
}
