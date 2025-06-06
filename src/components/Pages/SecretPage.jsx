import PropTypes from "prop-types";
import React from "react";
import Image from "../Image.jsx";

const size = 400;

/**
 * @param {Object} props
 * @param {string} props.rotate
 * @param {string} props.src
 */
function Face(props) {
	const { rotate, src } = props;

	return (
		<Image
			src={src}
			alt="Gato"
			width={size}
			height={size}
			sx={{
				position: "absolute",
				transform: `${rotate} translateZ(${0.5 * size}px)`
			}}
		/>
	);
}

function SecretPage() {
	const audio = React.useRef(null);

	const speed = 10000 / (Number(window.location.hash.split("#")[1] ?? 1));

	const rows = 5;

	const cells = [];

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < rows; x++) {
			const px = x / rows * 100;
			const py = y / rows * 100;
			cells.push([px, py, 1]);
		}
	}

	for (let y = 0; y < rows - 1; y++) {
		for (let x = 0; x < rows - 1; x++) {
			const px = (x + 0.5) / rows * 100;
			const py = (y + 0.5) / rows * 100;
			cells.push([px, py, -1]);
		}
	}

	React.useEffect(() => {
		if (audio.current) {
			if (audio.current.dataset.init === undefined) {
				document.addEventListener("click", () => {
					audio.current.play();
				});
			}

			audio.current.dataset.init = "true";
		}
	}, []);

	return (
		<>
			<style>
				{`@keyframes rotate {0%{transform:translateZ(-${0.5 * size}px) rotateX(0deg) rotateY(0deg);}100%{transform:translateZ(-${0.5 * size}px) rotateX(360deg) rotateY(720deg);}}`}
				{`@keyframes spin {
					0%{transform:rotate(0deg);}
					100%{transform:rotate(360deg);}
					}`}
				{`@keyframes spin-flip {
					0%{transform:scale(-1,1) rotate(0deg);}
					100%{transform:scale(-1,1) rotate(360deg);}
					}`}
				{`@keyframes super-spin {
					0%{transform:translate(-50%, -50%) rotate(0deg);filter:hue-rotate(0deg);}
					100%{transform:translate(-50%, -50%) rotate(360deg);filter:hue-rotate(360deg);}
					}`}
				{`@keyframes super-spin-flip {
					0%{transform:translate(-50%, -50%) scale(-1,1) rotate(0deg);filter:hue-rotate(0deg);}
					100%{transform:translate(-50%, -50%) scale(-1,1) rotate(360deg);filter:hue-rotate(360deg);}
					}`}
			</style>
			{
				speed <= 1000 &&
				<div style={{
					position: "absolute",
					width: "100vw",
					height: "100vh",
					left: 0,
					top: 0,
					zIndex: -2,
					overflow: "hidden"
				}}>
					<audio ref={audio} loop src="/images/misc/AMEN.mp3" style={{ display: "none" }} />
					<div style={{
						position: "absolute",
						width: "calc(1.4 * max(100vw, 100vh))",
						height: "calc(1.4 * max(100vw, 100vh))",
						left: "50%",
						top: "50%",
						zIndex: -1,
						animation: `super-spin-flip ${speed * 4}ms linear infinite`
					}}>
						{cells.map(([px, py, sx], i) => {
							return (
								<div key={i} style={{
									position: "absolute",
									left: `${px}%`,
									top: `${py}%`,
									width: `${100 / rows}%`,
									height: `${100 / rows}%`,
									backgroundImage: "url(/images/misc/dance.gif)",
									backgroundRepeat: "no-repeat",
									backgroundSize: "cover",
									backgroundPosition: "center",
									animation: `${sx === 1 ? "spin" : "spin-flip"} ${speed * 2}ms linear infinite`,
									filter: `hue-rotate(${1.8 * (px + py)}deg) blur(16px)`
								}} />
							);
						})}
					</div>
					<div style={{
						position: "absolute",
						width: "calc(1.2 * max(100vw, 100vh))",
						height: "calc(1.2 * max(100vw, 100vh))",
						left: "50%",
						top: "50%",
						zIndex: -1,
						animation: `super-spin ${speed * 4}ms linear infinite`
					}}>
						{cells.map(([px, py, sx], i) => {
							return (
								<div key={i} style={{
									position: "absolute",
									left: `${px}%`,
									top: `${py}%`,
									width: `${100 / rows}%`,
									height: `${100 / rows}%`,
									backgroundImage: "url(/images/misc/dance.gif)",
									backgroundRepeat: "no-repeat",
									backgroundSize: "cover",
									backgroundPosition: "center",
									animation: `${sx === 1 ? "spin" : "spin-flip"} ${speed * 2}ms linear infinite`,
									filter: `hue-rotate(${1.8 * (px + py)}deg)`
								}} />
							);
						})}
					</div>
				</div>
			}
			<div
				style={{
					width: size,
					height: size,
					margin: "200px auto 0 auto",
					perspective: "800px",
					perspectiveOrigin: "50% 50%"
				}}
			>
				<div style={{
					animation: `rotate ${speed}ms linear infinite`,
					width: size,
					height: size,
					position: "relative",
					transformStyle: "preserve-3d",
					transform: `translateZ(-${0.5 * size}px) rotateX(0deg) rotateY(0deg)`
				}}>
					<Face rotate="rotateY(0deg)" src="/images/misc/gato.png" />
					<Face rotate="rotateY(90deg)" src="/images/misc/oreo.png" />
					<Face rotate="rotateY(180deg)" src="/images/misc/gato.png" />
					<Face rotate="rotateY(270deg)" src="/images/misc/oreo.png" />
					<Face rotate="rotateX(90deg)" src="/images/misc/frank.png" />
					<Face rotate="rotateX(270deg)" src="/images/misc/frank.png" />
				</div>
			</div>
		</>
	);
}

Face.propTypes = {
	rotate: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired
};

export default SecretPage;
