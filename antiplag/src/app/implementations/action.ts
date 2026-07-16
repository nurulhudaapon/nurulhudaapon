// import looksSame from "looks-same";

import pixelmatch from "pixelmatch";

// base64 image to buffer
function base64ToBuffer(base64: string) {
    return Buffer.from(base64, 'base64');
}

// compare two images
export async function compareImages(base64Image1: string, base64Image2: string) {
    const buffer1 = base64ToBuffer(base64Image1);
    const buffer2 = base64ToBuffer(base64Image2);

    // Make sure the images are the same size
    if (buffer1.length !== buffer2.length) {
        // throw new Error('Images are not the same size');
    }

    const { width, height } = getImageSize(base64Image1);

    // const result = await looksSame(buffer1, buffer2);
    const result = pixelmatch(buffer1, buffer2, null, width, height, { threshold: 0.1 });

    console.log('RESULT', result);
}

// get image height and width from base64 in nodejs
export function getImageSize(base64: string) {
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid input string');
    }

    return {
        width: 100,
        height: 100,
    };
}