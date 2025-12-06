import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCLP, formatDate } from '@/lib/formatters';
import { ReportItem } from '@/features/invoicing/types/invoice.types';

const styles = StyleSheet.create({
    page: { flexDirection: 'column', padding: 30 },
    header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
    title: { fontSize: 24, marginBottom: 10 },
    subtitle: { fontSize: 12, color: '#666' },
    table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
    tableRow: { margin: 'auto', flexDirection: 'row' },
    tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
    tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 }
});

interface ReportProps {
    title: string;
    data: ReportItem[];
}

export const GenericReportPDF = ({ title, data }: ReportProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Generado el: {formatDate(new Date().toISOString())}</Text>
            </View>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Fecha</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Descripción</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Monto</Text>
                    </View>
                </View>

                {data.map((item, i) => (
                    <View style={styles.tableRow} key={i}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.date}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.description}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{formatCLP(item.amount)}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);
