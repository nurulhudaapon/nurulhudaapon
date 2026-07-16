import { calculateTextCosineSimilarity } from "../../algo";
import { executeQuery } from "../../query";
import { CodeBlockSimple } from "../algorithm/code-block";
import { compareImages } from "./action";


export default async function UserSignUp() {
  const codes = await executeQuery<
    { code: string; variation: string; algorithm: string, attachments: {images: []} }[]
  >("get_code_list");

  // const code = code.code;

  // console.log(codes);


  function matchingPercentage(currentCode: string, currentImg: string, currentIndex: number, variation: string) {
    let similiarity = 0;
    let similiarityCount = 0;

    let imgSimiliarity = 0;
    let imgSimiliarityCount = 0;

    codes.forEach((code, i) => {
      if (i !== currentIndex
        //  && code.variation === variation
        ) {
        similiarityCount++;
        similiarity += calculateTextCosineSimilarity(currentCode, code.code);

        const images = JSON.parse(code.attachments || '{}').images;
        const currentImages = JSON.parse(currentImg || '{}').images;
        if (images?.length) {
          compareImages(currentImages[0], images[0]);
          imgSimiliarityCount++;
          imgSimiliarity += calculateTextCosineSimilarity(currentImages[0], images[0]);
        }
      }

      // if (i !== currentIndex) {
      //   const images = JSON.parse(code.attachments || '{}').images;
      //   if (images?.length) {
      //     imgSimiliarityCount++;
      //     imgSimiliarity += calculateTextCosineSimilarity(images[0], images[0]);
      //   }
      // }

    });

    const result = similiarity / similiarityCount;
    const imgResult = imgSimiliarity / imgSimiliarityCount;

    console.log('IMG RESULT', imgResult, result);

    if (isNaN(result)) {
      return 0;
    }
    return result;
  }

  //  for await (const code of codes) {

  //   const images = JSON.parse(code.attachments || '{}').images;

  //   console.log('Image Match', images?.length);

  //   if (images?.length) {
  //     const image1 = images[0];
  //     // const image2 = images[1];
  //     console.log('Image 1');
  //     const result = await compareBase64Images(image1, image1);
  //     console.log('DIFF',result);
  //   }
    
  // };

  return (
    <div className="flex flex-wrap gap-3">
      {codes.map(async (code, i) => (
        <div
          key={code.algorithm}
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {code.algorithm}
          </h5>
          <h6 className="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
            {code.variation}
          </h6>
          {/* <CodeBlock key={algo.id}>{algo.code}</CodeBlock> */}
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {/* {generateAlgorithmDescription(algo.variation) || 'No description available'} */}
          </p>
          <CodeBlockSimple key={i}>{code.code}</CodeBlockSimple>

          {
            JSON.parse(code?.attachments || '{}')?.images?.map((image, index) => (
              <>
              {/* <h6 className="mb-2 tracking-tight text-gray-900 dark:text-white">
                {JSON.stringify(compareBase64Images(image, image))}
              </h6> */}
              <img
                key={index}
                src={image}
                alt={`Upload Preview ${index + 1}`}
                style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
              />

              </>
            ))
          }

          <h6 className="mb-2 tracking-tight text-gray-900 dark:text-white">
            {code.first_name} {code.last_name}: {code.email}
          </h6>
          <h6 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
            Similarity: {(matchingPercentage(code.code, code.attachments, i, code.variation) * 100).toFixed(2)}%
          </h6>
        </div>
      ))}
    </div>
  );
}

