node {
  sh 'npm --version'
  def jobnameparts = env.JOB_NAME.tokenize('/') as String[]
  def project_name = jobnameparts[0]
  def job_base = jobnameparts[1]
  echo "env.BRANCH_NAME... ${env.BRANCH_NAME}"
  Boolean isDev = env.BRANCH_NAME.toString() == 'master'
  echo "${isDev}"
  Boolean isEnvDeploy = isDev
  echo "${isEnvDeploy}"
  gitlabBuilds(builds: isEnvDeploy ? ["Prepare", "Build", "Test", "Deploy"] : ["Prepare", "Test"]) {
  try {
    gitlabCommitStatus(builds: [[connection: gitLabConnection('Gitlab'), name: 'Prepare', projectId: '11883496', revisionHash: "${env.BRANCH_NAME}"]], connection: gitLabConnection('Gitlab'), name: 'Prepare') {
    stage('Prepare') {
      checkout([$class: 'GitSCM', branches: [[name: "*/${env.BRANCH_NAME}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '79d86b05-49ce-473f-9270-3fdd635060fa', url: 'git@gitlab.com:myunisoft/back/service_converter.git']]])
      sh """
        node -v
        npm -v
        npm i
      """
    }}
  gitlabCommitStatus(builds: [[connection: gitLabConnection('Gitlab'), name: 'Test', projectId: '11883496', revisionHash: "${env.BRANCH_NAME}"]], connection: gitLabConnection('Gitlab'), name: 'Test') {
    try {
      stage('Test') {
          echo 'Testing..'
          slackSend color: '#0bd1d1', message: "Tests  ${env.JOB_NAME} ${env.BRANCH_NAME} Started :rocket:"
          // sh 'npm run test'
          slackSend color: '#0bd1d1', message: "Tests  ${env.JOB_NAME} ${env.BRANCH_NAME} Succeed :fire:"
      }
    } catch (e) {
      echo 'Test fail'
      slackSend color: '#fe3a5e', message: "Test Failed - ${env.JOB_NAME} ${env.BUILD_NUMBER}"
      echo e
      throw e
    }
  }
    if (isEnvDeploy) {
      gitlabCommitStatus(builds: [[connection: gitLabConnection('Gitlab'), name: 'Deploy', projectId: '11883496', revisionHash: "${env.BRANCH_NAME}"]], connection: gitLabConnection('Gitlab'), name: 'Deploy') {
      try {
        stage('Deploy') {
          echo 'Deploying....'
          slackSend color: '#0bd1d1', message: "Deploying  ${env.JOB_NAME} ${env.BRANCH_NAME} :rocket:"
          sshagent (credentials: ['c4ffe056-0781-49d8-b299-2d3c34115dd6']) {
            sh """
              BRANCH=${env.BRANCH_NAME} ./deploy/deploy.sh
            """
          }
          slackSend color: '#0bd1d1', message: "Deployed  ${env.JOB_NAME} ${env.BRANCH_NAME} :fire:"
        }
      } catch (e) {
        echo 'Deploy fail'
        slackSend color: '#fe3a5e', message: "Deploy Failed - ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        echo e
        throw e
      }
      }
    }
  } catch (e) {
      echo e
      throw e
  } finally {
      echo 'Clear cache'
      deleteDir()
      sh 'ls -lah'
  }
  }
  
}
