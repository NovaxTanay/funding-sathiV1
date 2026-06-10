// CreditAnalysisPDF.jsx — @react-pdf/renderer single-page PDF export
import {
  Document, Page, Text, View, StyleSheet, pdf, Font,
} from '@react-pdf/renderer';
import { formatDate } from '../../utils/formatDate';

const C = {
  indigo:  '#4f46e5',
  emerald: '#16a34a',
  amber:   '#d97706',
  red:     '#dc2626',
  dark:    '#0f172a',
  mid:     '#334155',
  light:   '#64748b',
  bg:      '#f8fafc',
  white:   '#ffffff',
};

const styles = StyleSheet.create({
  page:      { fontFamily: 'Helvetica', fontSize: 9, backgroundColor: C.white, padding: 32, color: C.dark },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  brand:     { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.indigo },
  meta:      { fontSize: 8, color: C.light, marginTop: 4 },
  section:   { marginBottom: 14, padding: 12, backgroundColor: C.bg, borderRadius: 6 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.light, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  badge:     { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 6 },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  body:      { fontSize: 9, color: C.mid, lineHeight: 1.5 },
  row:       { flexDirection: 'row', marginBottom: 3 },
  bullet:    { width: 14, color: C.indigo, fontFamily: 'Helvetica-Bold' },
  pill:      { backgroundColor: '#e0e7ff', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6, alignSelf: 'flex-start' },
  pillText:  { fontSize: 8, color: C.indigo, fontFamily: 'Helvetica-Bold' },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  gridItem:  { width: '47%', marginBottom: 4 },
  label:     { fontSize: 7, color: C.light, textTransform: 'uppercase' },
  value:     { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.dark, marginTop: 1 },
  actionBox: { borderLeftWidth: 3, borderLeftColor: C.indigo, paddingLeft: 10, paddingVertical: 6 },
  footer:    { position: 'absolute', bottom: 24, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8 },
  footerText:{ fontSize: 7, color: C.light },
});

function getBadgeColor(classification) {
  if (classification === 'Bankable')             return { bg: '#dcfce7', text: '#16a34a' };
  if (classification === 'Conditionally Bankable') return { bg: '#fef3c7', text: '#d97706' };
  return { bg: '#fee2e2', text: '#dc2626' };
}

function PDFDoc({ analysis, formData, leadId }) {
  const {
    viabilityVerdict, lenderRecommendation,
    riskFlags = [], documentChecklist = [], rmNextAction,
  } = analysis;
  const badgeColor = getBadgeColor(viabilityVerdict?.classification);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Funding Sathi</Text>
            <Text style={styles.meta}>Credit Assessment Report · {leadId || 'N/A'}</Text>
          </View>
          <Text style={styles.meta}>Generated: {formatDate(new Date().toISOString())}</Text>
        </View>

        {/* Borrower Snapshot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Borrower Profile</Text>
          <View style={styles.grid}>
            {[
              ['Entity Type',    formData?.entityType],
              ['Annual Turnover',`₹${formData?.annualTurnover} Cr`],
              ['Loan Required',  `₹${formData?.loanRequirement} Cr`],
              ['Loan Purpose',   formData?.loanPurpose],
              ['Bureau Score',   `${formData?.bureauScore} (CIBIL)`],
              ['Vintage',        `${formData?.businessVintage} years`],
              ['Location',       formData?.location],
              ['GST Status',     formData?.gstStatus],
            ].map(([k, v]) => (
              <View key={k} style={styles.gridItem}>
                <Text style={styles.label}>{k}</Text>
                <Text style={styles.value}>{v || '—'}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Viability Verdict */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deal Viability</Text>
          <View style={[styles.badge, { backgroundColor: badgeColor.bg }]}>
            <Text style={[styles.badgeText, { color: badgeColor.text }]}>
              {viabilityVerdict?.classification}
            </Text>
          </View>
          <Text style={styles.body}>{viabilityVerdict?.rationale}</Text>
        </View>

        {/* Lender Recommendation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lender Recommendation</Text>
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <View style={styles.pill}><Text style={styles.pillText}>Primary: {lenderRecommendation?.primaryCategory}</Text></View>
            {lenderRecommendation?.secondaryCategory && (
              <View style={styles.pill}><Text style={styles.pillText}>Fallback: {lenderRecommendation.secondaryCategory}</Text></View>
            )}
          </View>
          <Text style={styles.body}>{lenderRecommendation?.justification}</Text>
        </View>

        {/* Risk Flags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Flags</Text>
          {riskFlags.map((flag, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.bullet}>{i + 1}.</Text>
              <Text style={styles.body}>{flag}</Text>
            </View>
          ))}
        </View>

        {/* Document Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Checklist</Text>
          {documentChecklist.map((doc, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.bullet}>□</Text>
              <Text style={styles.body}>{doc}</Text>
            </View>
          ))}
        </View>

        {/* RM Next Action */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relationship Manager — Next Action</Text>
          <View style={styles.actionBox}>
            <Text style={styles.body}>{rmNextAction}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Funding Sathi (ESSGEEI Financial Pvt Ltd) — Internal Use Only</Text>
          <Text style={styles.footerText}>{leadId}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default async function generatePDF({ analysis, formData, leadId }) {
  const blob = await pdf(<PDFDoc analysis={analysis} formData={formData} leadId={leadId} />).toBlob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${leadId || 'credit-assessment'}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
