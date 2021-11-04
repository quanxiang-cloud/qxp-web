const workerContext: DedicatedWorkerGlobalScope = self as any; // self is the sub thread context

workerContext.onmessage = (e: MessageEvent<{
  blob: File,
  chunkSize: number,
  maxSmallFileSize: number
}>) => {
  importSparkMd5().then((SparkArrayBufferConstructor: any) => {
    calcFileMd5(e.data, SparkArrayBufferConstructor);
  });
};

function importSparkMd5(): Promise<unknown> {
  return import('spark-md5').then(({ default: { ArrayBuffer } }) => ArrayBuffer);
}

async function calcFileMd5(
  data: {blob: File, chunkSize: number, maxSmallFileSize: number},
  SparkArrayBufferConstructor: any): Promise<void> {
  const { blob, chunkSize, maxSmallFileSize } = data;
  const spark = new SparkArrayBufferConstructor();

  if (blob.size <= maxSmallFileSize) {
    blob.arrayBuffer().then((buffer: ArrayBuffer) => {
      spark.append(buffer);
      self.postMessage({
        percentage: 100,
        md5: spark.end(),
      });
    });
    return;
  }
  let processPercentage = 0;
  const fileChunks: Blob[] = Array.from(Array(Math.ceil(blob.size / chunkSize))).map((_, index) => {
    const offset = index * chunkSize;
    return blob.slice(offset, offset + chunkSize, blob.type);
  });
  const percentPerChunk = 100 / fileChunks.length;

  for (const chunk of fileChunks[Symbol.iterator]()) {
    try {
      spark.append(await chunk.arrayBuffer());
      processPercentage += percentPerChunk;
      self.postMessage({
        percentage: Math.floor(processPercentage),
      });
    } catch (error) {
      workerContext.close();
    }
  }

  self.postMessage({
    fileChunks,
    percentage: 100,
    md5: spark.end(),
  });
}

workerContext.onerror = () => {
  workerContext.close();
};

export default null as any;
