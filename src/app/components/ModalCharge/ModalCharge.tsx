import styles from './modal_charge.module.css';
import Loading from '../../../../public/loading.gif';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ModalChargeProps {
  actived: boolean;
}

export default function ModalCharge({ actived }: ModalChargeProps) {
  const [isActived, setIsActived] = useState(actived);

  useEffect(() => {
    setIsActived(actived);
  }, [actived]);

  return (
    <div className={`${isActived ? styles.contain_modal : styles.disable}`}>
      <div className={styles.content_modal}>
        <Image src={Loading} alt="Gif Loading" width={60} />
      </div>
    </div>
  );
}