import { Box, Typography } from '@mui/material';

import { useAtomValue } from 'jotai';
import {
  always,
  cond,
  equals,
  filter,
  gt,
  has,
  isNil,
  path,
  prop,
  reverse,
  sortBy,
  T
} from 'ramda';

import { useLocaleDateTimeFormat } from '../../../utils';
import type { Tooltip } from '../../Chart/models';
import { formatMetricValueWithUnit } from '../../common/timeSeries';
import type { TimeValue } from '../../common/timeSeries/models';
import { tooltipDataAtom } from '../atoms';
import { useBarChartTooltipStyles } from './useBarChartTooltipStyles';

interface Props extends Partial<Pick<Tooltip, 'mode' | 'sortOrder'>> {
  base: number;
  timeSeries: Array<TimeValue>;
}

const BarChartTooltip = ({
  timeSeries,
  base,
  mode,
  sortOrder
}: Props): JSX.Element | null => {
  const { classes } = useBarChartTooltipStyles();
  const { format } = useLocaleDateTimeFormat();
  const tooltipData = useAtomValue(tooltipDataAtom);

  if (isNil(tooltipData)) {
    return null;
  }

  if (has('thresholdLabel', tooltipData)) {
    return <Typography>{tooltipData.thresholdLabel}</Typography>;
  }

  const date = timeSeries[tooltipData.index].timeTick;
  const formattedDateTime = format({ date, formatString: 'L LTS' });

  const isSingleMode = equals(mode, 'single');

  const filteredMetrics = isSingleMode
    ? filter(
        ({ metric }) => equals(metric.metric_id, tooltipData.highlightedMetric),
        tooltipData.data
      )
    : tooltipData.data;

  const displayHighLightedMetric = gt(filteredMetrics.length, 1);

  const sortedMetrics = cond<[string | undefined], typeof filteredMetrics>([
    [
      equals('name') as (v: string | undefined) => boolean,
      always(
        sortBy(
          (item) => path(['metric', 'name'], item) as string,
          filteredMetrics
        )
      )
    ],
    [
      equals('ascending') as (v: string | undefined) => boolean,
      always(
        sortBy(
          prop('value') as (item: (typeof filteredMetrics)[number]) => number,
          filteredMetrics
        )
      )
    ],
    [
      equals('descending') as (v: string | undefined) => boolean,
      always(
        reverse(
          sortBy(
            prop('value') as (item: (typeof filteredMetrics)[number]) => number,
            filteredMetrics
          )
        )
      )
    ],
    [
      T as unknown as (v: string | undefined) => boolean,
      always(filteredMetrics)
    ]
  ])(sortOrder);

  return (
    <div className={classes.tooltipContainer}>
      <Typography fontWeight="bold" textAlign="center">
        {formattedDateTime}
      </Typography>
      <div className={classes.metrics}>
        {sortedMetrics.map(({ metric, value }) => (
          <div
            className={classes.metric}
            data-metric={metric.name}
            key={metric.metric_id}
          >
            <Box
              className={classes.metricColorBox}
              sx={{ backgroundColor: metric.color }}
            />
            <Typography
              className={classes.metricName}
              fontWeight={
                displayHighLightedMetric &&
                equals(tooltipData.highlightedMetric, metric.metric_id)
                  ? 'bold'
                  : 'regular'
              }
            >
              {metric.name}
            </Typography>
            <Typography
              fontWeight={
                displayHighLightedMetric &&
                equals(tooltipData.highlightedMetric, metric.metric_id)
                  ? 'bold'
                  : 'regular'
              }
            >
              {formatMetricValueWithUnit({
                base,
                unit: metric.unit,
                value
              })}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChartTooltip;
