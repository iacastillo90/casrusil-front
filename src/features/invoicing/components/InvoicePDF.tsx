import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Invoice } from '../types/invoice.types';
import { formatCLP, formatRut, formatDate } from '@/lib/formatters';

// Register font (optional, using standard fonts for now)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
    },
    companyInfo: {
        width: '60%',
    },
    dteBox: {
        width: '35%',
        borderWidth: 2,
        borderColor: '#cc0000',
        padding: 10,
        alignItems: 'center',
    },
    dteTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#cc0000',
        marginBottom: 5,
    },
    dteNumber: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    label: {
        width: 80,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    table: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#000',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        padding: 5,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        padding: 5,
    },
    colDesc: { width: '50%' },
    colQty: { width: '15%', textAlign: 'right' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right' },
    totals: {
        marginTop: 20,
        alignSelf: 'flex-end',
        width: '40%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalValue: {
        textAlign: 'right',
    },
});

interface InvoicePDFProps {
    invoice: Invoice;
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => (
    <Document>
        <Page size="LETTER" style={styles.page}>
            {/* Header with DTE Box */}
            <View style={styles.header}>
                <View style={styles.companyInfo}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>EMPRESA DEMO SPA</Text>
                    <Text>Giro: Servicios Informáticos</Text>
                    <Text>Dirección: Av. Providencia 1234, Santiago</Text>
                    <Text>RUT: 76.123.456-7</Text>
                </View>
                <View style={styles.dteBox}>
                    <Text style={styles.dteTitle}>R.U.T.: 76.123.456-7</Text>
                    <Text style={styles.dteTitle}>FACTURA ELECTRONICA</Text>
                    <Text style={styles.dteNumber}>Nº {invoice.folio}</Text>
                </View>
            </View>

            {/* Recipient Info */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Señor(es):</Text>
                    <Text style={styles.value}>{invoice.recipientName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>R.U.T.:</Text>
                    <Text style={styles.value}>{formatRut(invoice.recipientRut)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Fecha:</Text>
                    <Text style={styles.value}>{formatDate(invoice.issueDate)}</Text>
                </View>
            </View>

            {/* Lines Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.colDesc}>Descripción</Text>
                    <Text style={styles.colQty}>Cant.</Text>
                    <Text style={styles.colPrice}>P.Unit</Text>
                    <Text style={styles.colTotal}>Total</Text>
                </View>
                {invoice.lines.map((line, i) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={styles.colDesc}>{line.description}</Text>
                        <Text style={styles.colQty}>{line.quantity}</Text>
                        <Text style={styles.colPrice}>{formatCLP(line.unitPrice, false)}</Text>
                        <Text style={styles.colTotal}>{formatCLP(line.lineTotal, false)}</Text>
                    </View>
                ))}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Monto Neto:</Text>
                    <Text style={styles.totalValue}>{formatCLP(invoice.netAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>IVA (19%):</Text>
                    <Text style={styles.totalValue}>{formatCLP(invoice.taxAmount)}</Text>
                </View>
                <View style={[styles.totalRow, { borderTopWidth: 1, paddingTop: 5 }]}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>{formatCLP(invoice.totalAmount)}</Text>
                </View>
            </View>

            {/* Footer / Timbre */}
            <View style={{ position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center' }}>
                <Text>Timbre Electrónico SII</Text>
                <Text>Res. 80 de 2014 - Verifique documento: www.sii.cl</Text>
            </View>
        </Page>
    </Document>
);
