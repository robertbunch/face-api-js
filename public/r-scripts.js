

// const run = async()=>{
    //load models
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])

    //get images and canvas
    const refImage = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg')
    const imageToCheck = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg')
    const canvas = document.getElementById('canvas')

    //get ai data from reference image
    const refAiData = await faceapi
        .detectAllFaces(refImage)
        .withFaceLandmarks()
        .withFaceDescriptors()

    //build a FaceMatcher with the detection data from
    //our reference pic results. Can make label in another video
    //they are automatic
    let faceMatcher = new faceapi.FaceMatcher(refAiData)

    //get the faces/ai data from the image we are checking
    let facesAiData = await faceapi.detectAllFaces(imageToCheck)
        .withFaceLandmarks()
        .withFaceDescriptors()

    //use faceapi to resize canvas
    faceapi.matchDimensions(canvas, imageToCheck)
    // resize just in case
    facesAiData = faceapi.resizeResults(facesAiData, imageToCheck)

    //loop through all the faces and find the best match from our 
    //faceMatcher which is the reference image
    facesAiData.forEach(face => {
        const { detection, descriptor } = face
        //make our label from the best match
        let label = faceMatcher.findBestMatch(descriptor).toString()
        if(label.includes("unknown")){
            //if it includes "unkown, stop"
            return
        }
        //otherwise, use our reference info
        let options = { label: "Jordan" }
        const drawBox = new faceapi.draw.DrawBox(detection.box, options)
        drawBox.draw(canvas)
    })
}
run()