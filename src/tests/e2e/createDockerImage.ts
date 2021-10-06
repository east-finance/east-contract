import os from 'os';
import { execute } from "./utils";
import { imageName } from './constants'  

const network = os.networkInterfaces();
const local = network?.en0?.filter(({ family }) => family === 'IPv4') ?? [];
const hostIp = local[0].address;

export const createDockerImage = async () => {
  // const imageHash = 'e8569229b08f9b78f61914d86c423515cf8f1133a665afa0ae443a1a75b5f871'
  await execute(`docker build --build-arg HOST_NETWORK=${hostIp} -t ${imageName} .`);
  const inspectResult = await execute(`docker inspect ${imageName}`);
  const inspectData = JSON.parse(inspectResult)[0];
  const imageHash = inspectData.Id.replace('sha256:', '');
  return imageHash
}
