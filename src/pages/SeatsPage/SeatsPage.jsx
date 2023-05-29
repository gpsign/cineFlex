import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

export default function SeatsPage() {
	const id = useParams().id;
	const [movieSeats, setMovieSeats] = useState([]);
	const [chosen, setChosen] = useState([]);

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
						/>
					);
				})}
			</SeatsContainer>
			<CaptionContainer>
				<CaptionItem>
					<CaptionCircle situation={"red"} />
					Selecionado
				</CaptionItem>
				<CaptionItem>
					<CaptionCircle situation={"available"} />
					Disponível
				</CaptionItem>
				<CaptionItem>
					<CaptionCircle situation={"unavailable"} />
					Indisponível
				</CaptionItem>
			</CaptionContainer>
			<FormContainer>
				Nome do Comprador:
				<input placeholder="Digite seu nome..." />
				CPF do Comprador:
				<input placeholder="Digite seu CPF..." />
				<button>Reservar Assento(s)</button>
			</FormContainer>
			<FooterContainer>
				<div>
					<img src={movieSeats.movie.posterURL} alt="poster" />
				</div>
				<div>
					<p>{movieSeats.movie.title}</p>
					<p>
						{movieSeats.day.weekday} - {movieSeats.day.date}
					</p>
				</div>
			</FooterContainer>
		</PageContainer>
	) : (
		<h1>Carregando</h1>
	);
}

function SeatItem({ available, name, id, chosen, setChosen }) {
	const [color, setColor] = useState({
		background: "#C3CFD9",
		border: "#7B8B99",
	});

	useEffect(() => {
		if (!available) setColor({ background: "#FBE192", border: "#F7C52B" });
	}, []);

	return (
		<SeatItemDiv
			onClick={() => {
				if (available || chosen.includes(id)) {
					if (!chosen.includes(id)) {
						const updatedChosen = [...chosen, id];
						setChosen(updatedChosen);
						setColor({ background: "#1AAE9E", border: "#0E7D71" });
					} else {
						const updatedChosen = [...chosen];
						const ind = updatedChosen.indexOf(id, 0);
						updatedChosen.splice(ind, 1);
						setChosen(updatedChosen);
						setColor({ background: "#C3CFD9", border: "#7B8B99" });
					}
				}
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
	border: 1px solid
		${({ situation }) => {
			switch ({ situation }) {
				case "selected":
					return "#0E7D71";
				case "available":
					return "#7B8B99";
				case "unavailable":
					return "#F7C52B";
			}
		}};
	background-color: ${({ situation }) => situation};
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
