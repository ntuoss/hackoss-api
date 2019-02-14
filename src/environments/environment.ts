export const environment = {
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
    },
    eventbrite: {
        token: process.env.EVENTBRITE_TOKEN,
        organizationId: process.env.EVENTBRITE_ORGANIZATION_ID,
        organizerId: process.env.EVENTBRITE_ORGANIZER_ID
    },
    rebrandly: {
        apiUrl: process.env.REBRANDLY_API_URL,
        apiKey: process.env.REBRANDLY_API_KEY,
        domainId: process.env.REBRANDLY_DOMAIN_ID,
        links: {
            workshop: process.env.REBRANDLY_WORKSHOP_LINK_ID,
            live: process.env.REBRANDLY_LIVE_LINK_ID,
            feedback: process.env.REBRANDLY_FEEDBACK_LINK_ID
        }
    }
};
