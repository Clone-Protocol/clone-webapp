import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import PositionInfo from '~/components/Liquidity/borrow/PositionInfo'
import { PositionInfo as BorrowDetail } from '~/features/Liquidity/borrow/BorrowPosition.query'
import EditDetailDialog from './EditDetailDialog'
import EditBorrowMoreDialog from './EditBorrowMoreDialog'

const EditPanel = ({ assetId, borrowDetail, showRepayPosition, showWithdrawCollateral, onRefetchData }: { assetId: string, borrowDetail: BorrowDetail, showRepayPosition: boolean, showWithdrawCollateral: boolean, onRefetchData: () => void }) => {
  const [openEditDetail, setOpenEditDetail] = useState(false)
  const [openBorrowMore, setOpenBorrowMore] = useState(false)
  const borrowIndex = parseInt(assetId)

  useEffect(() => {
    if (showRepayPosition) {
      setOpenBorrowMore(true)
    }
  }, [showRepayPosition])

  useEffect(() => {
    if (showWithdrawCollateral) {
      setOpenEditDetail(true)
    }
  }, [showWithdrawCollateral])

  return borrowDetail ? (
    <Box>
      <PositionInfo
        positionInfo={borrowDetail}
        onShowEditForm={() => setOpenEditDetail(true)}
        onShowBorrowMore={() => setOpenBorrowMore(true)}
      />

      <EditDetailDialog
        open={openEditDetail}
        initEditType={showWithdrawCollateral ? 1 : 0}
        borrowId={borrowIndex}
        borrowDetail={borrowDetail}
        onHideEditForm={() => setOpenEditDetail(false)}
      />

      <EditBorrowMoreDialog
        open={openBorrowMore}
        initEditType={showRepayPosition ? 1 : 0}
        borrowId={borrowIndex}
        borrowDetail={borrowDetail}
        onHideEditForm={() => setOpenBorrowMore(false)}
      />
    </Box>
  ) : <></>
}

export default EditPanel
