"""
MediTalk UI Components - Reusable Streamlit widgets
"""
import streamlit as st
import pandas as pd


def load_custom_css(css_file_path: str):
    """Load custom CSS from file."""
    try:
        with open(css_file_path, 'r', encoding='utf-8') as f:
            css = f.read()
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
    except FileNotFoundError:
        st.warning(f"CSS file not found: {css_file_path}")


def render_hero_banner(title: str, subtitle: str):
    """Render a professional hero banner with modern styling."""
    st.markdown(f"""
    <div class="meditalk-hero">
        <h1>🩺 {title}</h1>
        <div class="meditalk-subtitle">{subtitle}</div>
    </div>
    """, unsafe_allow_html=True)


def render_metric_grid(metrics: list):
    """
    Render metrics in a responsive grid.
    
    Args:
        metrics: List of tuples [(label, value), ...]
    """
    st.markdown('<div class="metric-grid">', unsafe_allow_html=True)
    for label, value in metrics:
        st.markdown(f"""
        <div class="metric-item">
            <h4>{label}</h4>
            <div class="metric-value">{value}</div>
        </div>
        """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


def render_confidence_badge(confidence: float) -> str:
    """Return HTML for confidence badge."""
    if confidence > 0.7:
        cls = 'conf-high'
        label = 'High Confidence'
    elif confidence > 0.4:
        cls = 'conf-medium'
        label = 'Medium Confidence'
    else:
        cls = 'conf-low'
        label = 'Low Confidence'
    
    return f'<span class="conf-badge {cls}">{confidence:.1%} • {label}</span>'


def render_probability_chart(diseases: list, probabilities: list):
    """Render a horizontal bar chart for disease probabilities using Altair."""
    import altair as alt
    
    # Prepare data
    df = pd.DataFrame({
        'Disease': diseases,
        'Probability': probabilities
    })
    
    # Create chart
    chart = alt.Chart(df).mark_bar().encode(
        x=alt.X('Probability:Q', axis=alt.Axis(format='%'), title='Probability'),
        y=alt.Y('Disease:N', sort='-x', title=None),
        color=alt.Color('Probability:Q', scale=alt.Scale(scheme='tealblues'), legend=None),
        tooltip=['Disease:N', alt.Tooltip('Probability:Q', format='.1%')]
    ).properties(
        height=len(diseases) * 40 + 20
    ).configure_view(
        strokeWidth=0
    ).configure_axis(
        labelFontSize=12,
        titleFontSize=13
    )
    
    st.altair_chart(chart, use_container_width=True)


def render_symptom_chips(symptoms: list):
    """Render symptoms as chips."""
    st.markdown('<div>', unsafe_allow_html=True)
    for symptom in symptoms:
        st.markdown(f'<span class="symptom-chip">🔹 {symptom}</span>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


def render_alternative_diseases(diseases: list, probabilities: list):
    """Render alternative diseases as chips with probabilities."""
    st.markdown('<div>', unsafe_allow_html=True)
    for disease, prob in zip(diseases, probabilities):
        st.markdown(f'<span class="alt-chip">{disease} • {prob:.1%}</span>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


def render_precautions(precautions: list):
    """Render precautions list."""
    for precaution in precautions:
        st.markdown(f'<div class="precaution-item">✓ {precaution}</div>', unsafe_allow_html=True)


def render_card(content_html: str):
    """Wrap content in a modern card."""
    st.markdown(f'<div class="meditalk-card">{content_html}</div>', unsafe_allow_html=True)


def render_prediction_results(result: dict):
    """
    Render complete prediction results with professional modern UI.
    
    Args:
        result: Dictionary from DiseasePredictor.predict_disease()
    """
    # Professional header with card styling
    st.markdown("""
    <div class="meditalk-card" style="border-left: 4px solid var(--color-primary);">
        <h2 style="margin-bottom: 1rem; color: var(--color-primary);">🎯 Primary Diagnosis</h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Disease name and confidence in columns
    col1, col2 = st.columns([3, 1])
    
    with col1:
        st.markdown(f"""
        <div style="margin-bottom: 1rem;">
            <h1 style="color: var(--color-text-primary); font-size: 2.5rem; margin: 0;">{result['primary_disease']}</h1>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div style="text-align: right; margin-top: 1rem;">
            {render_confidence_badge(result['confidence'])}
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("<hr style='margin: 2rem 0; border: none; height: 1px; background: var(--color-border);'>", unsafe_allow_html=True)
    
    # Probability visualization in professional card
    all_diseases = [result['primary_disease']] + result['alternative_diseases']
    all_probs = [result['confidence']] + result['alternative_probabilities']
    
    st.markdown("#### 📊 Probability Analysis")
    render_probability_chart(all_diseases, all_probs)
    
    # Description section with improved styling
    with st.expander("📖 Detailed Disease Information", expanded=True):
        st.markdown(f"""
        <div class="meditalk-card">
            <p style="color: var(--color-text-secondary); line-height: 1.6; font-size: 1rem;">
                {result['description']}
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    # Precautions section with modern styling
    with st.expander("💊 Recommended Precautions & Care", expanded=True):
        st.markdown('<div class="meditalk-card">', unsafe_allow_html=True)
        render_precautions(result['precautions'])
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Alternative diseases section
    if result['alternative_diseases']:
        st.markdown("#### 🔄 Alternative Diagnostic Possibilities")
        st.markdown('<div class="meditalk-card">', unsafe_allow_html=True)
        render_alternative_diseases(result['alternative_diseases'], result['alternative_probabilities'])
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Recognized symptoms section
    if result.get('recognized_symptoms'):
        st.markdown("#### 🔍 Analyzed Symptoms")
        st.markdown('<div class="meditalk-card">', unsafe_allow_html=True)
        render_symptom_chips(result['recognized_symptoms'])
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Professional disclaimer
    st.markdown("""
    <div class="meditalk-card" style="background: var(--color-warning-light); border-left: 4px solid var(--color-warning);">
        <h4 style="color: var(--color-warning); margin-bottom: 1rem;">⚠️ Important Medical Disclaimer</h4>
        <p style="color: var(--color-text-primary); line-height: 1.6; margin: 0;">
            This AI-powered analysis is provided for <strong>informational and educational purposes only</strong>. 
            It should <strong>never be used as a substitute</strong> for professional medical advice, diagnosis, or treatment. 
            Always consult with a qualified healthcare professional for proper medical evaluation and treatment of any health condition.
            <br><br>
            <strong>In case of medical emergencies, please contact emergency services immediately.</strong>
        </p>
    </div>
    """, unsafe_allow_html=True)


def render_footer():
    """Render professional application footer."""
    st.markdown("""
    <div class="meditalk-footer">
        <p><strong>MediTalk AI</strong> © 2025 | Advanced AI Medical Consultation Assistant</p>
        <p style="color: var(--color-error); font-weight: 500;">🚨 For medical emergencies, contact emergency services immediately</p>
        <p>Developed by Azhar Ali, Amar Jaleel, and Hariz Zafar</p>
    </div>
    """, unsafe_allow_html=True)
