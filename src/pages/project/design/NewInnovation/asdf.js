<></>;

<form onSubmit={formik.handleSubmit}>
  <Card mb={12}>
    <CardContent>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Typography variant="h3" gutterBottom display="inline">
                Innovation Objectives
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            <Grid item md={6}>
              <TextField
                name="innovationType"
                label="Innovation Type"
                select
                value={formik.values.innovationType}
                error={Boolean(
                  formik.touched.innovationType && formik.errors.innovationType
                )}
                fullWidth
                helperText={
                  formik.touched.innovationType && formik.errors.innovationType
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Innovation Type
                </MenuItem>
                {!isLoadingInovationType
                  ? innovationTypeData.data.map((option) => (
                      <MenuItem
                        key={option.lookupItemId}
                        value={option.lookupItemId}
                      >
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="innovationClass"
              label="Innovation Class"
              select
              value={formik.values.innovationClass}
              error={Boolean(
                formik.touched.innovationClass && formik.errors.innovationClass
              )}
              fullWidth
              helperText={
                formik.touched.innovationClass && formik.errors.innovationClass
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Innovation Class
              </MenuItem>
              {!isLoadingInovationClass
                ? innovationClassData.data.map((option) => (
                    <MenuItem
                      key={option.lookupItemId}
                      value={option.lookupItemId}
                    >
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="innovationTechnology"
              label="Innovation Technology"
              select
              value={formik.values.innovationTechnology}
              error={Boolean(
                formik.touched.innovationTechnology &&
                  formik.errors.innovationTechnology
              )}
              fullWidth
              helperText={
                formik.touched.innovationTechnology &&
                formik.errors.innovationTechnology
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Innovation Technology
              </MenuItem>
              {!isLoadingInovationTechnology
                ? innovationTechnologyData.data.map((option) => (
                    <MenuItem
                      key={option.lookupItemId}
                      value={option.lookupItemId}
                    >
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <TextField
            name="whatMakesInnovation"
            label="What Makes This an Innovation"
            value={whatMakesInnovation}
            onChange={(e) => setWhatMakesInnovation(e.target.value)}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            my={2}
          />
          <TextField
            name="phcProblemSolved"
            label="What PHC Problem Does It Solve and How"
            value={phcProblemSolved}
            onChange={(e) => setPhcProblemSolved(e.target.value)}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            my={2}
          />
          <TextField
            name="estimatedImpact"
            label="Estimated Impact and Target Group"
            value={estimatedImpact}
            onChange={(e) => setEstimatedImpact(e.target.value)}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            my={2}
          />
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Typography variant="h3" gutterBottom display="inline">
                Innovation Metric
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                <AddIcon /> Add Innovation Metric
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Innovation Metric</TableCell>
                      <TableCell align="right">Target Group</TableCell>
                      <TableCell align="right">Reporting Frequency</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {InnovationMetricsArray.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.innovationMetric.lookupItemName}
                        </TableCell>
                        <TableCell align="right">
                          {row.innovationClass.lookupItemName}
                        </TableCell>
                        <TableCell align="right">
                          {row.reportingFrequency.lookupItemName}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => removeMetric(row)}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
          <br />
          <Button type="submit" variant="contained" color="primary" mt={3}>
            <Check /> Save changes
          </Button>
        </>
      )}
    </CardContent>
  </Card>
</form>;
