// @ts-nocheck
import PDFDocument from 'pdfkit'
import { pdfPresentationBuilderBySlides, pdfSlidesBuilder } from './g-slides-builder'
import { getPublicLink, patchToPublicFile, uploadPDF } from './google-module/drive-api-functions'
import PDFDocument from 'pdfkit';
import { authLayer } from './introduction-builder';
import { updateChat } from '../api/sender';


export const buildPDF = async (user: string, dataCallBack: any, endCallBack: any) => {
    // 1 inch = 72 points
    const widthInPoints = 25.4 * 72 / 2.54 
    const heightInPoints = 14.9 * 72 / 2.54

    // creat the first page with correct size
    const pdf = new PDFDocument({ size: [widthInPoints, heightInPoints], margin: 0 })
		// update title of presentation
		pdf.info.Title = user.title
		
		pdf.on('data', dataCallBack)
    pdf.on('end', endCallBack)

		await pdfSlidesBuilder(
			user,
			pdf,
			{
				width: widthInPoints,
				height: heightInPoints
			},
			undefined
		)

    pdf.end()
} 

export const buildPDFBotMaker = async (user: any) => {
    // 1 inch = 72 points
    const widthInPoints = 25.4 * 72 / 2.54 
    const heightInPoints = 14.9 * 72 / 2.54
    const pdf = new PDFDocument({ size: [widthInPoints, heightInPoints], margin: 0 })
    pdf.info.Title = user.presentationData.title



    const token = await authLayer(user.userEmail)

    const buildedPDF = await pdfPresentationBuilderBySlides(
			JSON.parse(JSON.stringify(user)),
			pdf,
			{
				width: widthInPoints,
				height: heightInPoints
			},
			true
		)
	buildedPDF.end()
	// console.log('pos-end')
	const createdId = await uploadPDF(token, buildedPDF)
	await patchToPublicFile(token, createdId)
	const createdPDFLink = await getPublicLink(token, createdId)

  console.log(user.userEmail, 'user.userEmail')
  console.log(createdId, 'createdId')
  console.log(user.channelId, 'user.channelId')
  console.log(user.userNumber, 'user.userNumber')
  await updateChat(user.userEmail, createdId, user.channelId, user.userNumber)

	console.log(createdId, 'id')
	console.log(createdPDFLink.data.webViewLink, 'link')
  // console.log(chat)
} 


