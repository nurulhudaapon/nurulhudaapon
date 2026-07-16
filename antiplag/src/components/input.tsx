'use client'
import { useState } from 'react';

export const Base64ImageInput = ({ name }: {name: string}) => {
    const [base64Images, setBase64Images] = useState<string[]>([]);

    const handleFileChange = async (e) => {
        const files = Array.from<File>(e.target.files);
        const base64Promises = files.map((file) => convertToBase64(file));
        const base64Images = (await Promise.all(base64Promises)) as string[];
        const compressedBase64Images = await Promise.all(base64Images.map(compressBase64Image));

        setBase64Images(compressedBase64Images);
    };

    const convertToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    console.log(JSON.stringify(base64Images || []))
    return (
        <div>
            <input
                type="file"
                name={name + '-file'}
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
            <textarea name={name} value={JSON.stringify(base64Images || [])} />
            <div>
                {base64Images.map((image, index) => (
                    <img key={index} src={image} alt={`Upload Preview ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
                ))}
            </div>
        </div>
    );
};
// Compress base64 image and return base64 string
function compressBase64Image(base64: string) {
    return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0, img.width, img.height);
            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob as Blob);
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
            }, 'image/jpeg', 0.7);
        };
    });
}