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
export default async function submitQuote({
  name,
  email,
  phone,
  description,
  contactMethod,
  file,
  houseFlatNumber,
  streetName,
  postcode,
}: QuotePayload) {
  const { db, storage } = getFirebase();

  try {
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
    });

    return docRef.id; // useful if you want to show a "ticket number"
  } catch (error) {
    console.error("Quote submission failed:", error);
    throw error; // Re-throw to let the UI component handle it
  }
}