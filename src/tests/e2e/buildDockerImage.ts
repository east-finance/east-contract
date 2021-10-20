import os from 'os';
import { execute } from "./utils";
import { imageName } from './constants'  

const network = os.networkInterfaces();
const local = network?.en0?.filter(({ family }) => family === 'IPv4') ?? [];
const hostIp = local[0].address;

export const buildDockerImage = async () => {
  await execute(`docker build --build-arg HOST_NETWORK=${hostIp} -t ${imageName} .`);
  const inspectResult = await execute(`docker inspect ${imageName}`);
  const inspectData = JSON.parse(inspectResult)[0];
  const imageHash = inspectData.Id.replace('sha256:', '');
  return imageHash
}
