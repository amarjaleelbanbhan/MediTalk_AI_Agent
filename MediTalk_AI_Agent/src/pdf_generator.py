"""
PDF Report Generator for MediTalk AI
Generates professional PDF reports of prediction results
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from datetime import datetime
from typing import Dict, Any, List
import io


class PDFReportGenerator:
    """Generates PDF reports for medical consultations."""
    
    @staticmethod
    def generate_report(result: Dict[str, Any], symptoms: List[str]) -> bytes:
        """
        Generate PDF report from prediction result.
        
        Args:
            result: Prediction result dictionary
            symptoms: List of input symptoms
            
        Returns:
            PDF content as bytes
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter,
                               rightMargin=72, leftMargin=72,
                               topMargin=72, bottomMargin=18)
        
        # Container for the 'Flowable' objects
        elements = []
        
        # Define styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#34495E'),
            spaceAfter=12,
            spaceBefore=12
        )
        
        # Title
        elements.append(Paragraph("MediTalk AI Medical Report", title_style))
        elements.append(Spacer(1, 12))
        
        # Date and time
        date_str = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        elements.append(Paragraph(f"<i>Generated on {date_str}</i>", styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Patient Symptoms Section
        elements.append(Paragraph("Reported Symptoms", heading_style))
        symptoms_text = ", ".join(symptoms)
        elements.append(Paragraph(symptoms_text, styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Primary Diagnosis Section
        elements.append(Paragraph("Primary Diagnosis", heading_style))
        elements.append(Paragraph(
            f"<b>{result['primary_disease']}</b>",
            styles['Heading3']
        ))
        
        confidence_pct = result['confidence'] * 100
        confidence_color = '#27AE60' if confidence_pct > 70 else '#F39C12' if confidence_pct > 40 else '#E74C3C'
        elements.append(Paragraph(
            f"<font color='{confidence_color}'>Confidence: {confidence_pct:.1f}%</font>",
            styles['Normal']
        ))
        elements.append(Spacer(1, 12))
        
        # Description
        elements.append(Paragraph("Description:", styles['Heading4']))
        elements.append(Paragraph(result['description'], styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Alternative Diagnoses
        if result['alternative_diseases']:
            elements.append(Paragraph("Alternative Diagnoses", heading_style))
            
            alt_data = [['Disease', 'Probability']]
            for disease, prob in zip(result['alternative_diseases'], result['alternative_probabilities']):
                alt_data.append([disease, f"{prob*100:.1f}%"])
            
            alt_table = Table(alt_data, colWidths=[4*inch, 1.5*inch])
            alt_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498DB')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(alt_table)
            elements.append(Spacer(1, 20))
        
        # Precautions
        if result['precautions']:
            elements.append(Paragraph("Recommended Precautions", heading_style))
            
            for i, precaution in enumerate(result['precautions'], 1):
                elements.append(Paragraph(
                    f"{i}. {precaution}",
                    styles['Normal']
                ))
            elements.append(Spacer(1, 20))
        
        # Disclaimer
        elements.append(Spacer(1, 30))
        disclaimer_style = ParagraphStyle(
            'Disclaimer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        elements.append(Paragraph(
            "<i><b>DISCLAIMER:</b> This report is generated by an AI system for informational purposes only. "
            "It should not be considered as professional medical advice. Please consult a qualified "
            "healthcare provider for proper diagnosis and treatment.</i>",
            disclaimer_style
        ))
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF content
        pdf_content = buffer.getvalue()
        buffer.close()
        
        return pdf_content
    
    @staticmethod
    def save_report(result: Dict[str, Any], symptoms: List[str], filename: str) -> None:
        """
        Save PDF report to file.
        
        Args:
            result: Prediction result dictionary
            symptoms: List of input symptoms
            filename: Output filename
        """
        pdf_content = PDFReportGenerator.generate_report(result, symptoms)
        
        with open(filename, 'wb') as f:
            f.write(pdf_content)
