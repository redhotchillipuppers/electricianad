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
    file: File | null;
  }
  
  /** Adds a quote + optional file to Firestore & Storage */
  export default async function submitQuote({
    name,
    email,
    phone,
    description,
    file,
  }: QuotePayload) {
    const { db, storage } = getFirebase();
  
    // 1. Upload file (if any) and grab URL
    let fileUrl = "";
    if (file) {
      const storageRef = ref(storage, `quotes/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }
  
    // 2. Save main quote document
    const docRef = doc(collection(db, "quotes"));
    await setDoc(docRef, {
      name,
      email,
      phone,
      description,
      fileUrl,
      createdAt: new Date().toISOString(),
    });
  
    return docRef.id; // useful if you want to show a “ticket number”
  }
  