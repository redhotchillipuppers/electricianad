import {
    getFirebase,
    collection,
    doc,
    setDoc,
} from "./firebase";

/** Payload shape coming from the Service Provider form */
export interface ServiceProviderPayload {
    firstName: string;
    lastName: string;
    companyName?: string;
    primaryContactNumber: string;
    email: string;
    serviceAreas: string[];
}

/** Adds a service provider application to Firestore */
export default async function submitServiceProvider(payload: ServiceProviderPayload) {
    const { db } = getFirebase();

    console.log('Firebase initialized:', { db: !!db });
    console.log('Service Provider payload received:', payload);

    try {
        // Validate required fields
        if (!payload.firstName?.trim() ||
            !payload.lastName?.trim() ||
            !payload.email?.trim() ||
            !payload.primaryContactNumber?.trim() ||
            !payload.serviceAreas?.length) {
            throw new Error('Missing required fields');
        }

        // Destructure payload for easier access
        const {
            firstName,
            lastName,
            companyName,
            primaryContactNumber,
            email,
            serviceAreas,
        } = payload;

        // Save service provider application document
        const docRef = doc(collection(db, "serviceProviders"));
        await setDoc(docRef, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            companyName: companyName?.trim() || "",
            primaryContactNumber: primaryContactNumber.trim(),
            email: email.trim().toLowerCase(),
            serviceAreas,
            status: "pending", // Can be: pending, approved, rejected
            createdAt: new Date().toISOString(),
        });

        console.log("Service provider application submitted with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Service provider submission failed:", error);

        // Provide user-friendly error messages
        if (error instanceof Error) {
            if (error.message.includes('permission')) {
                throw new Error('Unable to submit application. Please try again or contact us directly.');
            } else if (error.message.includes('network')) {
                throw new Error('Network error. Please check your connection and try again.');
            }
        }

        throw error;
    }
}