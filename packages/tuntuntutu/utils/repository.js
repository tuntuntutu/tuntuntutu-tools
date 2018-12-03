const git = require('simple-git');
const path = require('path');
const program = require('commander');
const fs = require('fs-extra');

const cloneRepo = (repoPath, gitWorking, projectName) => new Promise((resolve, reject) => {
  try {
    gitWorking.clone(repoPath, projectName, null, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  } catch (e) {
    reject(e);
  }
});


const checkout = (gitRepo, branch) => new Promise((resolve, reject) => {
  console.log(`正在签出分支 “${branch}”...`);
  try {
    gitRepo.checkout(branch, (err) => {
      resolve(!err);
    });
  } catch (e) {
    reject(e);
  }
});

/**
 * github上拉取模板工程
 * @param projectName 工程名称
 * @param repoPath 工程github地址
 * @returns {Promise<any>}
 */
exports.fetchFromGit = (projectName, repoPath) => (
  new Promise(async (resolve, reject) => {
    const localPath = process.cwd();
    const gitWorking = git(localPath);

    console.log('正在请求仓库...');
    try {
      // 克隆仓库
      await cloneRepo(repoPath, gitWorking, projectName);
      // 选择某个tag，并checkoout

      const gitRepo = git(path.join(localPath, projectName));

      await checkout(gitRepo, program.branch || 'master');

      // 删除.git目录， 脱离
      fs.remove(path.join(localPath, projectName, '.git'));
      resolve(true);
    } catch (e) {
      reject(typeof e === 'string' ? e : 'Internal Error');
    }
  }));
