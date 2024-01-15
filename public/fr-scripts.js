
//facial recognition
const run = async()=>{
    //we need to load our models
    //loading the models is going to use await
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])

    //refFace = we KNOW this is Michael Jordan
    const refFace = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg')
    const facesToCheck = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg')

    //we grab the reference image, and hand it to detectAllFaces method
    let refFaceAiData = await faceapi.detectAllFaces(refFace).withFaceLandmarks().withFaceDescriptors()
    let facesToCheckAiData = await faceapi.detectAllFaces(facesToCheck).withFaceLandmarks().withFaceDescriptors()
    // console.log(faceAIData)

    //get the canvas, and set it on top of the image
    //and make it the same size
    const canvas = document.getElementById('canvas')
    faceapi.matchDimensions(canvas,facesToCheck)

    //we need to make a face matcher!!
    //FaceMatcher is a constructor in faceapi
    //we hand it our reference AI data
    let faceMatcher = new faceapi.FaceMatcher(refFaceAiData)
    facesToCheckAiData = faceapi.resizeResults(facesToCheckAiData,facesToCheck)

    //loop through all of hte faces in our imageToCheck and compare to our reference datta
    facesToCheckAiData.forEach(face=>{
        const { detection, descriptor } = face
        //make a label, using the default
        let label = faceMatcher.findBestMatch(descriptor).toString()
        console.log(label)
        if(label.includes("unknown")){
            return
        }
        let options = { label: "Jordan"}
        const drawBox = new faceapi.draw.DrawBox(detection.box,options)
        drawBox.draw(canvas)
    })

}   

run()