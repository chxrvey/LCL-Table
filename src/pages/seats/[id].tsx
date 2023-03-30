import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@mui/material';
import { Movie, Seats } from '../../constants/models/Movies';
import styles from './Seats.module.scss';
import MoviesContext from '../../context/MoviesContext';
import { TableAvailability } from '../../constants/TableAvailability'; 


const SeatSelection = (): JSX.Element => {
  const { movies } = useContext(MoviesContext);
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { id, seats } = router.query as { id: string, seats: string };
  const movie = movies.find((mov: Movie) => mov.id === parseInt(id));
  const [seatDetails, setSeatDetails] = useState<Seats>(movie?.seats || {});

  

  useEffect(() => {
    if (!seats) {
      clearSelectedSeats();
    }
  }, []);

  const clearSelectedSeats = (): void => {
    let newMovieSeatDetails = { ...seatDetails };
    for (let key in seatDetails) {
      seatDetails[key].forEach((seatValue, seatIndex) => {
        if (seatValue === 2) {
          newMovieSeatDetails[key][seatIndex] = 0;
        }
      });
    }
    setSeatDetails(newMovieSeatDetails);
  };

  const onSeatClick = (seatValue: number, rowIndex: number, key: string): void => {
    if (seatDetails) {
      if (seatValue === 1 || seatValue === 3) {
        return;
      } else if (seatValue === 0) {
        seatDetails[key][rowIndex] = 2;
      } else {
        seatDetails[key][rowIndex] = 0;
      }
    }
    setSeatDetails({ ...seatDetails });
  };

  /**
   * 0 - Not booked
   * 1 - Booked
   * 2 - Selected
   * 3 - Blocked
   */
  const getClassNameForSeats = (seatValue: number): string => {
    let dynamicClass: string;
    if (seatValue === 0) {
      dynamicClass = styles.seatNotBooked;
    } else if (seatValue === 1) {
      dynamicClass = styles.seatBooked;
    } else if (seatValue === 2) {
      dynamicClass = styles.seatSelected;
    } else {
      dynamicClass = styles.seatBlocked;
    }
    return `${styles.seats} ${dynamicClass}`;
  };

  const RenderSeats = (): JSX.Element => {
    let seatArray = [];
    for (let key in seatDetails) {
      let colValue = seatDetails[key].map((seatValue, rowIndex) => (
        <span key={`${key}.${rowIndex}`} className={styles.seatsHolder}>
          {rowIndex === 0 && <span className={styles.colName}>{key}</span>}
          <span
            className={getClassNameForSeats(seatValue)}
            onClick={() => onSeatClick(seatValue, rowIndex, key)}
          >
            {rowIndex + 1}
          </span>
          {seatDetails && rowIndex === seatDetails[key].length - 1 && (
            <span className={styles.colName}>{key}</span>
          )}
        </span>
      ));
      seatArray.push(<div key={key}>{colValue}</div>);
    }
    return <div>{seatArray}</div>;
  };
  return (
    <div className={styles.seatsWrapper}>
      <div className={styles.seatsTitle}>
        {/* <h1>{movie?.title} - Seats</h1> */}
      </div>
      <div className={styles.seatsContainer}>
        <RenderSeats />
      </div>
      <div className={styles.seatsFooter}>
      {/* <TableAvailability seatDetails={seatDetails} handleSeatSelection={handleSeatSelection} selectedSeats={selectedSeats} /> */}
        <div className={styles.seatsFooterRight}>
          <p>Selected seats: {selectedSeats.join(', ')}</p>
          <Link href={`/checkout/${id}/${selectedSeats.join('-')}`}>
            <Button variant="contained" disabled={!selectedSeats.length}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )};
  
