import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuoteData } from '@/types/quote';

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14213D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  greeting: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  intro: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333333',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14213D',
    marginTop: 25,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2px solid #FCA311',
  },
  featureBlock: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#14213D',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 11,
    color: '#555555',
    marginBottom: 10,
    lineHeight: 1.5,
  },
  bulletList: {
    marginLeft: 15,
  },
  bulletItem: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 5,
    lineHeight: 1.4,
  },
  priceSection: {
    backgroundColor: '#FCA311',
    padding: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceDetails: {
    fontSize: 9,
    color: '#FFFFFF',
    marginTop: 8,
  },
  includesBlock: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
  },
  includesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  includesItem: {
    fontSize: 10,
    color: '#1B5E20',
    marginBottom: 5,
  },
  whySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  whyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#14213D',
    marginBottom: 10,
  },
  whyItem: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 5,
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1px solid #CCCCCC',
  },
  footerText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 5,
  },
  emoji: {
    fontSize: 14,
  },
});

interface PDFQuoteTemplateProps {
  data: QuoteData;
}

export const PDFQuoteTemplate = ({ data }: PDFQuoteTemplateProps) => {
  const formattedDate = data.date || new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currencySymbol = data.currency === 'PEN' ? 'S/' : '$';
  const priceFormatted = `${currencySymbol} ${data.price.toLocaleString('es-PE')}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🚀 {data.projectTitle}</Text>
          <Text style={styles.subtitle}>Soluciones Integrales JS - GargurevichDigital</Text>
          <Text style={styles.subtitle}>Fecha: {formattedDate}</Text>
          {data.clientName && (
            <Text style={styles.subtitle}>Para: {data.clientName}{data.clientCompany ? ` - ${data.clientCompany}` : ''}</Text>
          )}
        </View>

        {/* Greeting */}
        <View>
          <Text style={styles.greeting}>Hola 👋</Text>
          <Text style={styles.intro}>
            {data.projectDescription || 'Te comparto la propuesta para el proyecto que estuvimos conversando.'}
          </Text>
          <Text style={styles.intro}>
            La idea no es solo tener una landing bonita, sino una plataforma profesional que te permita 
            alcanzar tus objetivos, actualizar contenido de forma fácil y proyectar una imagen sólida y moderna.
          </Text>
        </View>

        {/* Features Section */}
        <View>
          <Text style={styles.sectionTitle}>🌐 ¿Qué incluye la solución?</Text>
          
          {data.features.map((feature, index) => (
            <View key={index} style={styles.featureBlock}>
              <Text style={styles.featureTitle}>
                {feature.icon} {feature.title}
              </Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
              
              {feature.items && feature.items.length > 0 && (
                <View style={styles.bulletList}>
                  {feature.items.map((item, itemIndex) => (
                    <Text key={itemIndex} style={styles.bulletItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>💰 Inversión</Text>
          <Text style={styles.priceValue}>{priceFormatted}</Text>
          <Text style={styles.priceDetails}>Setup + 1 año incluido • Tiempo de entrega: {data.deliveryTime}</Text>
        </View>

        {/* Includes Section */}
        {data.includes && data.includes.length > 0 && (
          <View style={styles.includesBlock}>
            <Text style={styles.includesTitle}>✅ Incluye:</Text>
            {data.includes.map((item, index) => (
              <Text key={index} style={styles.includesItem}>
                ✓ {item}
              </Text>
            ))}
          </View>
        )}

        {/* Why Section */}
        <View style={styles.whySection}>
          <Text style={styles.whyTitle}>🤝 ¿Por qué esta solución vale la pena?</Text>
          <Text style={styles.whyItem}>• No es una web genérica</Text>
          <Text style={styles.whyItem}>• No dependes de terceros para actualizar</Text>
          <Text style={styles.whyItem}>• Refuerza tu imagen profesional</Text>
          <Text style={styles.whyItem}>• Es una base sólida para seguir creciendo</Text>
          <Text style={styles.whyItem}>• Optimizada para rendimiento y SEO</Text>
        </View>

        {/* Notes */}
        {data.notes && data.notes.length > 0 && (
          <View style={{ marginTop: 20 }}>
            {data.notes.map((note, index) => (
              <Text key={index} style={{ fontSize: 10, color: '#666666', marginBottom: 5 }}>
                {note}
              </Text>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Quedo atento a cualquier ajuste o mejora que quieras hacer 🙌
          </Text>
          <Text style={styles.footerText}>
            La idea es que este proyecto sea el inicio de más trabajos juntos 💪
          </Text>
          <Text style={[styles.footerText, { marginTop: 15, fontWeight: 'bold' }]}>
            GargurevichDigital - Soluciones Web Profesionales
          </Text>
          <Text style={styles.footerText}>
            contacto@gargurevichdigital.com | +51 966 918 363
          </Text>
        </View>
      </Page>
    </Document>
  );
};
