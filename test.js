const exampleData = [
  {
    body: '#### Setup keyring\n```sh\ncurl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg\necho "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list\n```\n\n#### Install Redis\n```sh\nsudo apt-get update\nsudo apt-get install redis\n```\n\n#### Check Version\n```sh\nredis-cli --version\n```',
    images: '',
    parent_id: null,
    title: 'Redis First Installation & Setup - Linux',
    uid: 2,
  },
  {
    body: 'Merge Node two',
    images: null,
    parent_id: 2,
    title: 'Merge Node two',
    uid: 21,
  },
  //   {
  //     body: 'Merge Node',
  //     images: null,
  //     parent_id: 21,
  //     title: 'Merge Node',
  //     uid: 20,
  //   },
  //   {
  //     body: 'Append Node',
  //     images: null,
  //     parent_id: 20,
  //     title: 'Append Node',
  //     uid: 19,
  //   },
];

const run = () => {
  const totalNodes = exampleData.length;
  const nodesMap = new Map();
  const parentNodesMap = new Map();

  exampleData.forEach((node) => nodesMap.set(node.uid, node));
  exampleData.forEach((node) => node.parent_id && parentNodesMap.set(node.parent_id, node));

  const elements = [];
  let currentIndex = 0;
  let parentData = null;
  let found = false;

  while (!found) {
    if (!exampleData[currentIndex].parent_id) {
      found = true;
      parentData = exampleData[currentIndex];
      break;
    } else {
      currentIndex += 1;
    }
  }

  elements.push(parentData);
  while (elements.length !== totalNodes) {
    const cElement = parentNodesMap.get(parentData.uid);
    elements.push(cElement);
    parentData = cElement;
  }

  console.log(elements);
};

run();
