import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

export default function SeatsPage({ setUsrInformation }) {
	const [name, setName] = useState("");
	const [cpf, setCpf] = useState("");

	const id = useParams().id;
	const [movieSeats, setMovieSeats] = useState([]);
	const [chosen, setChosen] = useState([]);

	const [seatsName, setSeatsName] = useState([]);

	const cpfMask = (value) => {
		return value
			.replace(/\D/g, "")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})/, "$1-$2")
			.replace(/(-\d{2})\d+?$/, "$1");
	};
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(
				`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${id}/seats`
			)
			.then((seatsList) => {
				setMovieSeats(seatsList.data);
			})
			.catch((response) => {
				console.log(response.status);
			});
	});

	function reserveSeats(event) {
		event.preventDefault();

		const usrOrder = {
			ids: chosen,
			name: name,
			cpf: cpf,
		};

		axios.post(
			"https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many",
			usrOrder
		);
	}

	return movieSeats.seats ? (
		<PageContainer>
			Selecione o(s) assento(s)
			<SeatsContainer>
				{movieSeats.seats.map((seat) => {
					return (
						<SeatItem
							key={seat.name}
							available={seat.isAvailable}
							name={seat.name}
							id={seat.id}
							chosen={chosen}
							setChosen={setChosen}
							seatsName={seatsName}
							setSeatsName={setSeatsName}
						/>
					);
				})}
			</SeatsContainer>
			<CaptionContainer>
				<CaptionItem>
					<CaptionCircle
						situationBackground={"#1AAE9E"}
						situationBorder={"#0E7D71"}
					/>
					Selecionado
				</CaptionItem>
				<CaptionItem>
					<CaptionCircle
						situationBackground={"#C3CFD9"}
						situationBorder={"#7B8B99"}
					/>
					Disponível
				</CaptionItem>
				<CaptionItem>
					<CaptionCircle
						situationBackground={"#FBE192"}
						situationBorder={"#F7C52B"}
					/>
					Indisponível
				</CaptionItem>
			</CaptionContainer>
			<FormContainer>
				<form
					onSubmit={(e) => {
						reserveSeats(e);
						let updatedCpf = cpf;
						if (cpf.length > 14) {
							updatedCpf = updatedCpf.slice(0, -1);
							setCpf(updatedCpf);
							console.log(updatedCpf);
						}
						setUsrInformation({
							title: movieSeats.movie.title,
							date: movieSeats.day.date,
							hour: movieSeats.name,
							seats: seatsName,
							name: name,
							cpf: updatedCpf,
						});
						navigate("/sucesso");
					}}
				>
					<label htmlFor="name">Nome do Comprador:</label>
					<input
						data-test="client-name"
						id="name"
						placeholder="Digite seu nome..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>

					<label htmlFor="cpf">CPF do Comprador:</label>
					<input
						data-test="client-cpf"
						id="cpf"
						placeholder="Digite seu CPF..."
						value={cpfMask(cpf)}
						onChange={(e) => setCpf(e.target.value)}
						required
					/>
					<button data-test="book-seat-btn" type="submit">
						Reservar Assento(s)
					</button>
				</form>
			</FormContainer>
			<FooterContainer data-test="footer">
				<div>
					<img src={movieSeats.movie.posterURL} alt="poster" />
				</div>
				<div>
					<p>{movieSeats.movie.title}</p>
					<p>
						{movieSeats.day.weekday} - {movieSeats.name}
					</p>
				</div>
			</FooterContainer>
		</PageContainer>
	) : (
		<h1>Carregando</h1>
	);
}

function SeatItem({
	available,
	name,
	id,
	chosen,
	setChosen,
	seatsName,
	setSeatsName,
}) {
	const [color, setColor] = useState({
		background: "#C3CFD9",
		border: "#7B8B99",
	});

	useEffect(() => {
		if (!available) setColor({ background: "#FBE192", border: "#F7C52B" });
	}, []);

	return (
		<SeatItemDiv
			data-test="seat"
			onClick={() => {
				if (available || chosen.includes(id)) {
					if (!chosen.includes(id)) {
						const updatedChosen = [...chosen, id];
						setChosen(updatedChosen);
						setColor({ background: "#1AAE9E", border: "#0E7D71" });

						const updatedSeatsName = [...seatsName, name];
						setSeatsName(updatedSeatsName);
					} else {
						const updatedChosen = [...chosen];
						const ind = updatedChosen.indexOf(id, 0);
						updatedChosen.splice(ind, 1);
						setChosen(updatedChosen);
						setColor({ background: "#C3CFD9", border: "#7B8B99" });

						const updatedSeatsName = [...seatsName];
						const indName = updatedSeatsName.indexOf(name);
						updatedSeatsName.splice(indName, 1);
						setSeatsName(updatedSeatsName);
					}
				} else if (!available) alert("Esse assento não está disponível");
			}}
			background={color.background}
			border={color.border}
		>
			{name}
		</SeatItemDiv>
	);
}

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	font-family: "Roboto";
	font-size: 24px;
	text-align: center;
	color: #293845;
	margin-top: 30px;
	padding-bottom: 120px;
	padding-top: 70px;
`;
const SeatsContainer = styled.div`
	width: 330px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`;
const FormContainer = styled.div`
	width: calc(100vw - 40px);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 20px 0;
	font-size: 18px;
	button {
		align-self: center;
	}
	input {
		width: calc(100vw - 60px);
	}
`;
const CaptionContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 300px;
	justify-content: space-between;
	margin: 20px;
`;
const CaptionCircle = styled.div`
	border: 1px solid ${({ situationBorder }) => situationBorder};
	background-color: ${({ situationBackground }) => situationBackground};
	height: 25px;
	width: 25px;
	border-radius: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 5px 3px;
`;
const CaptionItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 12px;
`;
const SeatItemDiv = styled.div`
	cursor: pointer;
	user-select: none;
	border: 1px solid ${({ border }) => border};
	background-color: ${({ background }) => background};
	height: 25px;
	width: 25px;
	border-radius: 25px;
	font-family: "Roboto";
	font-size: 11px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 5px 3px;
`;
const FooterContainer = styled.div`
	width: 100%;
	height: 120px;
	background-color: #c3cfd9;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 20px;
	position: fixed;
	bottom: 0;

	div:nth-child(1) {
		box-shadow: 0px 2px 4px 2px #0000001a;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		margin: 12px;
		img {
			width: 50px;
			height: 70px;
			padding: 8px;
		}
	}

	div:nth-child(2) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		p {
			text-align: left;
			&:nth-child(2) {
				margin-top: 10px;
			}
		}
	}
`;
