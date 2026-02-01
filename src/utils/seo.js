/**
 * SEO Utility Functions for CrazyDealsOnline
 */

/**
 * Create SEO-friendly slug from book title and ID
 * Example: "The Art of War" + "abc123" -> "the-art-of-war-abc123"
 */
export function createBookSlug(title, id) {
    if (!title || !id) return id || '';

    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
        .replace(/(^-|-$)/g, '')       // Remove leading/trailing hyphens
        .substring(0, 50);              // Limit length

    return `${slug}-${id}`;
}

/**
 * Extract ID from slug (ID is the last segment after final hyphen)
 * Works for both slug format and plain ID format for backward compatibility
 * Example: "the-art-of-war-abc123" -> "abc123"
 * Example: "abc123" -> "abc123"
 */
export function extractIdFromSlug(slug) {
    if (!slug) return '';

    // MongoDB ObjectIds are 24 characters
    // If slug is exactly 24 chars and alphanumeric, it's likely just an ID
    if (slug.length === 24 && /^[a-f0-9]+$/i.test(slug)) {
        return slug;
    }

    const parts = slug.split('-');
    return parts[parts.length - 1];
}

/**
 * Default SEO configuration
 */
export const defaultSEO = {
    siteName: 'CrazyDealsOnline',
    siteUrl: 'https://crazydealsonline.in',
    defaultTitle: 'CrazyDeals Online Books Store - Buy Books Online @ Free Delivery',
    defaultDescription: 'CrazyDeals Online Books Store - Buy Self Help Books, Hindi English Biography, Hindi Sahitya, Mystery, Fiction, Military and Testprep Exam Books with Free Delivery.',
    defaultImage: 'https://i.postimg.cc/7GhqH8ST/logo.png',
    twitterHandle: '@crazydealsonline',
};
