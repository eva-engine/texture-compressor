// Native
import { spawn } from 'child_process';
import { platform } from 'os';
import { join } from 'path';

export const getBinaryDirectory = (): string => join(__dirname, '../../bin/', platform());

/**
 * Spawn a child process of a texture compression tool (e.g. PVRTexTool, Crunch)
 *
 * @param args Command line arguments
 * @param flagMapping Flags to pass to the texture compression tool
 * @param binaryName Name of the texture compression tool
 */
export const spawnProcess = (
  args: Record<string, any>,
  flagMapping: string[],
  binaryName: string
): Promise<any> => {
  const toolPath = join(getBinaryDirectory(), binaryName);
  const toolFlags: string[] = [];
  const combinedFlags = [...flagMapping, ...toolFlags];

  return new Promise(
    (resolve, reject): void => {
      if (args.verbose) {
        console.log(`Using flags: ${combinedFlags}`);
      }

      const child = spawn(toolPath, combinedFlags, {
        env: {
          PATH: getBinaryDirectory(),
        },
      });

      if (args.verbose) {
        child.stdout.on('data', (data: string) => console.log(`${data}`));

        child.stderr.on('data', (data: string) => {
          console.log(`${data}`);
        });
      }
      child.once('exit', (code: number) => {
        if (code !== 0) {
          reject(new Error(`Compression tool exited with error code ${code}`));
        } else {
          resolve(0);
        }
      });
    }
  );
};
