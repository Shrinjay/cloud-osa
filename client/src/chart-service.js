export function generateChartData(trace, min = 0, max = 1) {
    
    return trace.xdata
    .map((x, i) => (
        {
            x: x,
            y: trace.ydata[i]
        }
    ))
    .filter(data => {
        return data.x < max * 10 ** -9 && data.x > min * 10 ** -9
    })
}