node {
    stage('Preparation') { // for display purposes
        // Get some code from a GitHub repository
        checkout scm
        //gradleHome = tool 'gradle-3'
    }
    stage('Build') {
        // Run the gradle assemble
        echo 'Building'
        sh "ng build --prod"
    }
    stage('Deploy') {
        sh 'scp -r dist/* sub_adm@wp-np2-58:/data/www/content/in'
        cleanWs()
    }
}