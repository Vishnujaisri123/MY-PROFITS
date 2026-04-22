// frontend/src/components/ArcReactor.jsx
import { useEffect, useRef, useState } from "react";

export default function ArcReactor({ portfolio, apPortfolio, onSystemMode }) {
  const reactorRef = useRef(null);
  const valueRef = useRef(null);
  const sceneRef = useRef(null);
  const [flipped, setFlipped] = useState(false);

  const totalProfit = portfolio.gold.totalProfit + portfolio.silver.totalProfit;
  const totalValue = portfolio.gold.totalValue + portfolio.silver.totalValue;
  const isProfit = totalProfit >= 0;

  const apGoldProfit = apPortfolio?.gold?.totalProfit ?? 0;
  const apSilverProfit = apPortfolio?.silver?.totalProfit ?? 0;
  const apTotalProfit = apGoldProfit + apSilverProfit;
  const apTotalValue = (apPortfolio?.gold?.totalValue ?? 0) + (apPortfolio?.silver?.totalValue ?? 0);
  const apIsProfit = apTotalProfit >= 0;

  const apProfitFactor = Math.min(Math.abs(apTotalProfit) / 500000, 1);
  const apSpeedOuter = apIsProfit ? 28 - apProfitFactor * 14 : 32 + apProfitFactor * 10;
  const apSpeedMiddle = apIsProfit ? 18 - apProfitFactor * 8 : 22 + apProfitFactor * 8;
  const apSpeedInner = apIsProfit ? 12 - apProfitFactor * 6 : 16 + apProfitFactor * 6;

  /* ENERGY SURGE */
  useEffect(() => {
    if (!reactorRef.current) return;
    reactorRef.current.classList.add("arc-surge");
    const t = setTimeout(() => reactorRef.current?.classList.remove("arc-surge"), 400);
    return () => clearTimeout(t);
  }, [totalValue]);

  /* VALUE MICRO-ANIMATION */
  useEffect(() => {
    if (!valueRef.current) return;
    valueRef.current.classList.add("changed");
    const t = setTimeout(() => valueRef.current?.classList.remove("changed"), 400);
    return () => clearTimeout(t);
  }, [totalValue]);

  /* PROFIT → ROTATION SPEED */
  const profitFactor = Math.min(Math.abs(totalProfit) / 500000, 1);
  const speedOuter = isProfit ? 28 - profitFactor * 14 : 32 + profitFactor * 10;
  const speedMiddle = isProfit ? 18 - profitFactor * 8 : 22 + profitFactor * 8;
  const speedInner = isProfit ? 12 - profitFactor * 6 : 16 + profitFactor * 6;

  /* 3D HOVER – tilt the whole scene, not the inner arc-core */
  const handleMove = (e) => {
    if (!sceneRef.current || flipped) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 20;
    const rotateX = -(((e.clientY - rect.top) / rect.height) - 0.5) * 20;
    sceneRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetRotation = () => {
    if (!sceneRef.current) return;
    sceneRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div style={styles.wrapper}>
      <div
        ref={sceneRef}
        style={styles.flipScene}
        onMouseMove={handleMove}
        onMouseLeave={resetRotation}
      >
        <div style={{ ...styles.flipCard, ...(flipped ? styles.flipCardFlipped : {}) }}>

          {/* ── FRONT ── */}
          <div style={styles.flipFace}>
            <div
              ref={reactorRef}
              className={`arc-core ${isProfit ? "arc-profit" : "arc-loss"}`}
              onClick={() => setFlipped(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="hud-ticks" />
              <div className="hud-connector top" />
              <div className="hud-connector right" />
              <div className="hud-connector bottom" />
              <div className="hud-connector left" />

              <div className="ring ring-outer" style={{ animationDuration: `${speedOuter}s` }} />
              <div className="ring ring-middle" style={{ animationDuration: `${speedMiddle}s` }} />
              <div className="ring ring-inner" style={{ animationDuration: `${speedInner}s` }} />

              <div style={styles.centerText}>
                <div style={styles.label}>TOTAL PORTFOLIO</div>
                <div ref={valueRef} className="hud-value" style={styles.value}>
                  ₹ {totalValue.toFixed(0)}
                </div>
                <div className={isProfit ? "hud-cool" : "hud-warm"} style={styles.profit}>
                  {isProfit ? "▲ PROFIT" : "▼ LOSS"} ₹ {Math.abs(totalProfit).toFixed(0)}
                </div>
                <div style={styles.flipHint}>TAP FOR AP ▶</div>
                {onSystemMode && (
                  <div
                    style={styles.systemBtn}
                    onClick={(e) => { e.stopPropagation(); onSystemMode(); }}
                  >
                    ⛶ FULLSCREEN
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── BACK ── */}
          <div style={styles.flipFaceBack}>
            <div
              className={`arc-core ${apIsProfit ? "arc-profit" : "arc-loss"}`}
              onClick={() => setFlipped(false)}
              style={{ cursor: "pointer" }}
            >
              <div className="hud-ticks" />
              <div className="hud-connector top" />
              <div className="hud-connector right" />
              <div className="hud-connector bottom" />
              <div className="hud-connector left" />

              <div className="ring ring-outer" style={{ animationDuration: `${apSpeedOuter}s` }} />
              <div className="ring ring-middle" style={{ animationDuration: `${apSpeedMiddle}s` }} />
              <div className="ring ring-inner" style={{ animationDuration: `${apSpeedInner}s` }} />

              <div style={styles.centerText}>
                <div style={styles.label}>AP PORTFOLIO</div>
                <div className="hud-value" style={styles.value}>
                  ₹ {apTotalValue.toFixed(0)}
                </div>
                <div className={apIsProfit ? "hud-cool" : "hud-warm"} style={styles.profit}>
                  {apIsProfit ? "▲ PROFIT" : "▼ LOSS"} ₹ {Math.abs(apTotalProfit).toFixed(0)}
                </div>
                <div style={styles.flipHint}>◀ TAP TO FLIP BACK</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  flipScene: {
    perspective: "1200px",
    transition: "transform 0.15s ease-out",
  },
  flipCard: {
    position: "relative",
    width: "clamp(200px, 80vw, 320px)",
    height: "clamp(200px, 80vw, 320px)",
    transformStyle: "preserve-3d",
    transition: "transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
  },
  flipCardFlipped: {
    transform: "rotateY(180deg)",
  },
  flipFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  },
  flipFaceBack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
  },
  centerText: {
    textAlign: "center",
    zIndex: 2,
    fontFamily: "Inter, Arial",
    width: "100%",
    padding: "0 20px",
    boxSizing: "border-box",
  },
  label: {
    fontSize: "11px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "var(--hud-muted)",
    marginBottom: "10px",
  },
  value: {
    fontSize: "30px",
    fontFamily: "Orbitron, Arial",
    fontWeight: 500,
    color: "var(--hud-white)",
  },
  profit: {
    marginTop: "6px",
    fontSize: "13px",
    letterSpacing: "1px",
    fontFamily: "Inter, Arial",
  },
  flipHint: {
    marginTop: "14px",
    fontSize: "9px",
    letterSpacing: "2px",
    color: "var(--hud-muted)",
    opacity: 0.6,
  },
  systemBtn: {
    marginTop: "10px",
    fontSize: "8px",
    letterSpacing: "2px",
    color: "var(--hud-muted)",
    opacity: 0.5,
    cursor: "pointer",
  },
};
