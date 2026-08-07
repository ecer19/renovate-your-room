import { Document, Page, View, Text, Image, Link, StyleSheet, Font } from "@react-pdf/renderer";

// Standart PDF fontları (Helvetica vb.) Türkçe karakterleri (ı, ş, ğ, İ) desteklemez.
// Noto Sans, Latin Extended kapsamıyla tüm Türkçe karakterleri içeriyor — tek bir
// değişken (variable) font dosyasından hem normal hem kalın ağırlığı kaydediyoruz.
// Bu bileşen tarayıcı içinde çalıştığı için mutlak URL kullanıyoruz (göreli yol
// fetch ile Node ortamında çözülemez, tarayıcıda ise origin'e ihtiyaç duyar).
const fontUrl = typeof window !== "undefined" ? `${window.location.origin}/fonts/NotoSans.ttf` : "/fonts/NotoSans.ttf";

Font.register({
  family: "NotoSans",
  fonts: [
    { src: fontUrl, fontWeight: 400 },
    { src: fontUrl, fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const INK = "#241c14";
const INK_SOFT = "#6b5a45";
const ACCENT = "#c1531b";
const TEAL = "#1f4d3e";
const PAPER = "#f1e9dc";
const LINE = "#dccdb0";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "NotoSans",
    color: INK,
  },
  coverPage: {
    padding: 48,
    fontFamily: "NotoSans",
    color: INK,
    backgroundColor: PAPER,
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: ACCENT,
    fontFamily: "NotoSans",
    fontWeight: 700,
    marginBottom: 10,
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: "NotoSans",
    fontWeight: 700,
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 13,
    color: INK_SOFT,
    marginBottom: 30,
  },
  coverMetaRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 20,
  },
  coverMetaBlock: {
    borderLeft: `2px solid ${ACCENT}`,
    paddingLeft: 10,
  },
  coverMetaLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: INK_SOFT,
    marginBottom: 3,
  },
  coverMetaValue: {
    fontSize: 12,
    fontFamily: "NotoSans",
    fontWeight: 700,
  },
  footerBrand: {
    fontSize: 9,
    color: INK_SOFT,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "NotoSans",
    fontWeight: 700,
    marginBottom: 14,
    color: INK,
  },
  bigImage: {
    width: "100%",
    height: 480,
    objectFit: "cover",
    borderRadius: 4,
  },
  compareRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  compareCol: {
    flex: 1,
  },
  compareImage: {
    width: "100%",
    height: 260,
    objectFit: "cover",
    borderRadius: 4,
    marginBottom: 6,
  },
  compareLabel: {
    fontSize: 9,
    fontFamily: "NotoSans",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
    color: INK_SOFT,
  },
  card: {
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    padding: 14,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: "NotoSans",
    fontWeight: 700,
    marginBottom: 8,
    color: INK,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    color: INK_SOFT,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 10,
    color: ACCENT,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
    color: INK_SOFT,
  },
  twoCol: {
    flexDirection: "row",
    gap: 16,
  },
  colHalf: {
    flex: 1,
  },
  subheading: {
    fontSize: 9,
    fontFamily: "NotoSans",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  productCard: {
    border: `1px solid ${LINE}`,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  productName: {
    fontSize: 11,
    fontFamily: "NotoSans",
    fontWeight: 700,
    marginBottom: 3,
  },
  productDesc: {
    fontSize: 9.5,
    color: INK_SOFT,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  productReason: {
    fontSize: 9,
    color: TEAL,
    fontFamily: "NotoSans",
    marginBottom: 5,
  },
  productLink: {
    fontSize: 9,
    color: ACCENT,
    textDecoration: "none",
  },
  paletteRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  swatchBlock: {
    flex: 1,
    alignItems: "center",
  },
  swatchBox: {
    width: "100%",
    height: 56,
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    marginBottom: 6,
  },
  swatchName: {
    fontSize: 8.5,
    fontFamily: "NotoSans",
    fontWeight: 700,
    textAlign: "center",
  },
  swatchHex: {
    fontSize: 8,
    color: INK_SOFT,
    textAlign: "center",
  },
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: INK_SOFT,
    textAlign: "center",
    borderTop: `0.5px solid ${LINE}`,
    paddingTop: 8,
  },
});

function BulletList({ items, color = ACCENT }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={[styles.bulletDot, { color }]}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function PageFooter() {
  return (
    <Text style={styles.pageFooter} fixed>
      Generated with Renovate Your Room — AI Powered Interior Design
    </Text>
  );
}

export default function RenovationReportDocument({ roomLabel, style, result }) {
  const analysis = result.analysis || {};
  const dateLabel = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date());

  return (
    <Document title="Renovate Your Room — AI Interior Design Report">
      {/* Kapak */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.eyebrow}>AI Interior Design Report</Text>
          <Text style={styles.coverTitle}>Renovate Your Room</Text>
          <Text style={styles.coverSubtitle}>Yapay zekâ destekli oda yeniden tasarım raporu</Text>

          <View style={styles.coverMetaRow}>
            <View style={styles.coverMetaBlock}>
              <Text style={styles.coverMetaLabel}>Oluşturulma Tarihi</Text>
              <Text style={styles.coverMetaValue}>{dateLabel}</Text>
            </View>
            <View style={styles.coverMetaBlock}>
              <Text style={styles.coverMetaLabel}>Oda Türü</Text>
              <Text style={styles.coverMetaValue}>{roomLabel}</Text>
            </View>
            <View style={styles.coverMetaBlock}>
              <Text style={styles.coverMetaLabel}>Stil</Text>
              <Text style={styles.coverMetaValue}>{style}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerBrand}>renovate-your-room · AI Powered Interior Design</Text>
      </Page>

      {/* Orijinal fotoğraf */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Orijinal Fotoğraf</Text>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={result.originalImageUrl} style={styles.bigImage} />
        <PageFooter />
      </Page>

      {/* Yeni tasarım */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Yeni Tasarım</Text>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={result.generatedImageUrl} style={styles.bigImage} />
        <PageFooter />
      </Page>

      {/* Before/After + Danışman */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Before / After</Text>
        <View style={styles.compareRow}>
          <View style={styles.compareCol}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={result.originalImageUrl} style={styles.compareImage} />
            <Text style={styles.compareLabel}>Önce</Text>
          </View>
          <View style={styles.compareCol}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={result.generatedImageUrl} style={styles.compareImage} />
            <Text style={styles.compareLabel}>Sonra</Text>
          </View>
        </View>

        {analysis.advisor && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI Dekorasyon Danışmanı</Text>
            <Text style={styles.paragraph}>{analysis.advisor}</Text>
          </View>
        )}
        <PageFooter />
      </Page>

      {/* Önce/Sonra analizi + ipuçları */}
      {(analysis.before || analysis.tips) && (
        <Page size="A4" style={styles.page}>
          {analysis.before && analysis.after && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Önce / Sonra Analizi</Text>
              <View style={styles.twoCol}>
                <View style={styles.colHalf}>
                  <Text style={[styles.subheading, { color: ACCENT }]}>Önce</Text>
                  <BulletList items={analysis.before} color={ACCENT} />
                </View>
                <View style={styles.colHalf}>
                  <Text style={[styles.subheading, { color: TEAL }]}>Sonra</Text>
                  <BulletList items={analysis.after} color={TEAL} />
                </View>
              </View>
            </View>
          )}

          {analysis.tips && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Dekorasyon İpuçları</Text>
              <BulletList items={analysis.tips} color={ACCENT} />
            </View>
          )}
          <PageFooter />
        </Page>
      )}

      {/* Ürün önerileri */}
      {analysis.products && analysis.products.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>AI Ürün Önerileri</Text>
          {analysis.products.map((product, i) => (
            <View key={i} style={styles.productCard}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDesc}>{product.description}</Text>
              {product.reason && <Text style={styles.productReason}>{product.reason}</Text>}
              <Link
                style={styles.productLink}
                src={`https://www.google.com/search?q=${encodeURIComponent(product.name)}`}
              >
                İnternette Ara →
              </Link>
            </View>
          ))}
          <PageFooter />
        </Page>
      )}

      {/* Renk paleti + genel değerlendirme */}
      {(analysis.palette || analysis.summary) && (
        <Page size="A4" style={styles.page}>
          {analysis.palette && analysis.palette.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Renk Paleti</Text>
              <View style={styles.paletteRow}>
                {analysis.palette.map((color, i) => (
                  <View key={i} style={styles.swatchBlock}>
                    <View style={[styles.swatchBox, { backgroundColor: color.hex }]} />
                    <Text style={styles.swatchName}>{color.name}</Text>
                    <Text style={styles.swatchHex}>{color.hex}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {analysis.summary && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Genel Değerlendirme</Text>
              <Text style={styles.paragraph}>{analysis.summary}</Text>
            </View>
          )}
          <PageFooter />
        </Page>
      )}
    </Document>
  );
}
