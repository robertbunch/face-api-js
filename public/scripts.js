
//facial detection
const run = async()=>{
    //we need to load our models
    //loading the models is going to use await
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])

    const face1 = document.getElementById('face')
    // const face1 = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg/220px-Elon_Musk_Colorado_2022_%28cropped2%29.jpg')

    //we grab the image, and hand it to detectAllFaces method
    let faceAIData = await faceapi.detectAllFaces(face1).withFaceLandmarks().withFaceDescriptors().withAgeAndGender()
    // console.log(faceAIData)

    //get the canvas, and set it on top of the image
    //and make it the same size
    const canvas = document.getElementById('canvas')
    canvas.style.left = face1.offsetLeft
    canvas.style.top = face1.offsetTop
    canvas.height = face1.height
    canvas.width = face1.width

    //let's draw our bounding box on our face/image!
    faceAIData = faceapi.resizeResults(faceAIData,face1)
    faceapi.draw.drawDetections(canvas,faceAIData)

    //ask AI to guess the age and gender
    faceAIData.forEach(face=>{
        const { age, gender, genderProbability } = face
        const genderText = `${gender} - ${genderProbability}`
        const ageText = `${Math.round(age)} years`
        const textField = new faceapi.draw.DrawTextField([genderText,ageText],face.detection.box.topRight)
        textField.draw(canvas)
    })

    //Do face recognition = check to see if one face matches another

}

run()