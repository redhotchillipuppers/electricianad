import {
  getFirebase,
  collection,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "./firebase";

/** Payload shape coming from the React form */
export interface QuotePayload {
  name: string;
  email: string;
  phone?: string;
  description: string;
  contactMethod: string;
  file: File | null;
  houseFlatNumber: string;
  streetName: string;
  postcode: string;
}

/** Adds a quote + optional file to Firestore & Storage */
export default async function submitQuote(payload: QuotePayload) {
  const { db, storage } = getFirebase();

    console.log('Firebase initialized:', { db: !!db, storage: !!storage });
    console.log('Payload received:', { ...payload, file: payload.file ? 'File present' : 'No file' });


  try {
    // Validate required fields
    if (!payload.name?.trim() || !payload.email?.trim() || !payload.contactMethod) {
      throw new Error('Missing required fields');
    }

    // Destructure payload for easier access
    const {
      name,
      email,
      phone,
      description,
      contactMethod,
      file,
      houseFlatNumber,
      streetName,
      postcode,
    } = payload;

    // 1. Upload file (if any) and grab URL
    let fileUrl = "";
    if (file) {
      try {
        // Use a more robust filename that handles special characters
        const safeFileName = encodeURIComponent(file.name.replace(/[^a-zA-Z0-9.-]/g, '_'));
        const storageRef = ref(storage, `quotes/${Date.now()}-${safeFileName}`);
        
        console.log("Uploading file:", file.name, "Size:", file.size);
        const uploadResult = await uploadBytes(storageRef, file);
        console.log("Upload complete:", uploadResult);
        
        fileUrl = await getDownloadURL(storageRef);
        console.log("File URL obtained:", fileUrl);
      } catch (fileError) {
        console.error("File upload failed:", fileError);
        throw new Error(`File upload failed: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
      }
    }

    // 2. Save main quote document
    const docRef = doc(collection(db, "quotes"));
    await setDoc(docRef, {
      name,
      email,
      phone,
      description,
      contactMethod,
      fileUrl,
      houseFlatNumber,
      streetName,
      postcode,
      createdAt: new Date().toISOString(),
      assignedProviderId: null, // Initially unassigned
    });

    return docRef.id; // useful if you want to show a "ticket number"
  } catch (error) {
    console.error("Quote submission failed:", error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        throw new Error('Unable to submit quote. Please try again or contact us directly.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
    
    throw error; // Re-throw to let the UI component handle it
  }
}