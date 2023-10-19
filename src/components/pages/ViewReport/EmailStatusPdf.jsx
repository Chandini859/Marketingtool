import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    padding: '10mm', // Add padding to give some space around the content
  },
  section: {
    flexGrow: 1,
    alignItems: 'center', // Center the content vertically
  },
  table: {
    display: 'table',
    width: 'auto',
    margin: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center', // Center the content vertically
  },
  tableCell: {
    width: 'auto', // Adjusted the width to 'auto'
    padding: '3mm',
    border: '1px solid #000',
  },
});

const EmailStatusesPDF = ({ emailStatusesSet }) => {
  // Divide data into chunks to handle pagination
  const chunkSize = 10; // Set the number of rows per page
  const dataChunks = [];
  for (let i = 0; i < emailStatusesSet.length; i += chunkSize) {
    dataChunks.push(emailStatusesSet.slice(i, i + chunkSize));
  }

  return (
    <Document>
      {dataChunks.map((dataChunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Email Statuses Count Data:</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>Email Status ID</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Customer Name</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Organization</Text>
                </View>
              </View>
              {dataChunk.map(status => (
                <View key={status.id} style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text>{status.id}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{status.customerMaster.customerName}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{status.customerMaster.organization}</Text>
                  </View>
                  {/* Add more fields as needed */}
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default EmailStatusesPDF;
