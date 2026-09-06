export interface CopyFormData {
  businessName: string;
  location: string;
  mainProductService: string;
  targetAudience: string;
}

export interface SocialPost {
  theme: string;
  platform: string;
  hook: string;
  caption: string;
  callToAction: string;
  hashtags: string[];
}

export interface SocialMediaResult {
  summary?: string;
  posts: SocialPost[];
  copyableText: string;
}

export interface GoogleBusinessProfileResult {
  headline: string;
  updateBody: string;
  callToAction: string;
  suggestedButtonType?: string;
  copyableText: string;
}

export interface SeoKeywordsResult {
  primaryLocalKeywords: string[];
  highIntentKeywords: string[];
  longTailQueries: string[];
  copyableText: string;
}

export interface GeneratedCopyResponse {
  socialMedia: SocialMediaResult;
  googleBusinessProfile: GoogleBusinessProfileResult;
  seoKeywords: SeoKeywordsResult;
}
