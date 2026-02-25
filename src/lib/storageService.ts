import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = (
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const filePath = `${path}/${Date.now()}_${file.name}`;
        console.log(`Starting upload to: ${filePath}`, { size: file.size, type: file.type });

        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload progress for ${file.name}: ${progress.toFixed(2)}%`);
                if (onProgress) onProgress(progress);
            },
            (error) => {
                console.error("Upload failed with error code:", error.code);
                console.error("Full error object:", error);

                // Provide more user-friendly error messages based on Firebase error codes
                if (error.code === 'storage/unauthorized') {
                    reject(new Error("Permission denied. Please check your storage rules."));
                } else if (error.code === 'storage/canceled') {
                    reject(new Error("Upload canceled."));
                } else {
                    reject(error);
                }
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log(`Upload successful for ${file.name}. URL: ${downloadURL}`);
                    resolve(downloadURL);
                } catch (urlError) {
                    console.error("Failed to get download URL:", urlError);
                    reject(urlError);
                }
            }
        );
    });
};

