export default function PreviewPane({ design }) {
  const {
    heading,
    subHeading,
    body,
    watermark,
    logo,
    image,
    typography,
    colors,
    imageSettings,
  } = design;

  return (
    <div
      style={{
        position: "relative",
        width: "629px", // fixed frame width
        height: "1079px", // fixed frame height
       
        overflow: "hidden",
      }}
    >
      {/* 🖼 Full frame background */}
      <img
        src={`${import.meta.env.BASE_URL}images/report-frame.jpg`}
        alt="Frame Background"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", // ✅ fills container fully
          zIndex: 0,
        }}
      />

      {/* 🧾 Content Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          padding: "133px 40px",
          textAlign: typography.textAlign || "center",
          backgroundColor: "transparent", // ✅ no white overlay
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "20px" }}>
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "120px",
                height: "auto",
                margin: "0 auto",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                margin: "0 auto",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "50px",
                background: "transparent",
              }}
            >
              LOGO
            </div>
          )}
        </div>

        {/* Headings */}
        <h1
          style={{
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight,
            fontSize: typography.headingSize,
            color: colors.heading,
            marginBottom: "10px",
            padding: "6px 20px",
          }}
        >
          {heading}
        </h1>

        <h2
          style={{
            fontFamily: typography.subHeadingFont,
            fontWeight: typography.subHeadingWeight,
            fontSize: typography.subHeadingSize,
            color: colors.subHeading,
            marginBottom: "10px",
          }}
        >
          {subHeading}
        </h2>

        <p
          style={{
            fontFamily: typography.bodyFont,
            fontWeight: typography.bodyWeight,
            fontSize: typography.bodySize,
            color: colors.body,
            marginBottom: "40px",
          }}
        >
          {body}
        </p>

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "120px",
            left: 0,
            right: 0,
            opacity: 0.15,
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {watermark}
        </div>

        {/* Main image */}
        <div>
          {image ? (
            <img
              src={image}
              alt="Main"
              style={{
                borderRadius: `${imageSettings.radius}px`,
                width: "100%", // ✅ always 100% width
                height: "auto",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%", // ✅ full width
                height: "200px",
                border: "1px dashed #aaa",
                borderRadius: `${imageSettings.radius}px`,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent", // ✅ no white
              }}
            >
              Image
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
