module.exports = {
  searchContract: (filter) => {
    let queryString = `
      SELECT
        *,
        IFNULL(CR.cnt, 0) AS CT_REPLYCNT 
      FROM
        contract_send CT
      LEFT JOIN(
        SELECT
          CR_NUM,
          count(*) AS cnt
        FROM
          contract_reply
        GROUP BY
          CR_NUM
      ) CR
      ON
        CT.CT_NUM = CR.CR_NUM
      WHERE
        1=1
    `;
    
    if(filter.usrid){ // usrid 로 필터링할경우
      queryString += `
       AND ct_usrid = '${filter.usrid}'
      `;
    }

    if(filter.proid){ // proid 로 필터링할경우
      queryString += `
        AND ct_num IN (
          SELECT
            cr_num
          FROM
            contract_reply
          WHERE
            cr_proid = '${filter.proid}'
        )`;
    }

    if(filter.keyword){ // 제목 및 내용 검색
      const keyword = decodeURIComponent(filter.keyword);
      queryString += `
        AND (
          ct_brand LIKE '%${keyword}%' 
          OR ct_model LIKE '%${keyword}%'  
          OR ct_title LIKE '%${keyword}%'
        )`;
    }
    if(filter.kind){ // 제목 및 내용 검색
      queryString += `
        AND ct_kind = '${filter.kind}'
      `;
    }

    // 진행상태, 마감상태 순으로 최근 100개 반환
    queryString += `
      ORDER BY
        ct_stat DESC, 
        ct_dttm DESC, 
        ct_no DESC
        LIMIT
          0, 99
    `;

    return queryString;
  },

}