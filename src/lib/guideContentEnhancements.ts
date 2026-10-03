import type { GuideFAQ, GuideSection } from './guideContent';

type Enhancement = { sections: GuideSection[]; faqs: GuideFAQ[] };

export const guideContentEnhancements: Record<string, Enhancement> = {};
