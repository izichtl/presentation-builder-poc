// @ts-nocheck
import PDFDocument from 'pdfkit'
import { pdfSlidesBuilder } from './g-slides-builder'



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
			}
		)

    pdf.end()
} 