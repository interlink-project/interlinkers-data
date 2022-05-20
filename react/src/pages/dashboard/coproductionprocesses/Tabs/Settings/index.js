import { Avatar, Box, Button, CardHeader, Grid, IconButton, Input, Stack, TextField as MuiTextField, Typography } from "@material-ui/core";
import { Delete, Edit, Save } from '@material-ui/icons';
import ConfirmationButton from "components/ConfirmationButton";
import MainSkeleton from "components/MainSkeleton";
import { Form, Formik, useFormikContext } from 'formik';
import useDependantTranslation from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import $ from 'jquery';
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { updateProcess } from "slices/process";
import * as Yup from 'yup';
import { coproductionProcessesApi } from "__api__";

const SettingsTab = () => {
    const [editMode, setEditMode] = useState(false)
    const [initialData, setInitialData] = useState({})
    const { process, updating } = useSelector((state) => state.process);
    const [logotype, setLogotype] = useState(null);
    const mounted = useMounted()
    const { t } = useDependantTranslation()

    const navigate = useNavigate()

    const onRemove = () => {
        coproductionProcessesApi.delete(process.id).then(() => navigate("/dashboard"))
    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (!editMode) {
            $(".ql-toolbar").remove()

        }
        setInitialData({
            name: process.name || "",
            description: process.description || "",
            organization: process.organization || "",
            aim: process.aim || "",
            idea: process.idea || "",
            challenges: process.challenges || "",
            submit: null
        })
    }, [editMode, process]);

    const handleFileSelected = (e) => {
        const files = e.target.files
        if (files.length > 0) {
            const file = files[0]
            if (file) {
                file.path = URL.createObjectURL(file)
                setLogotype(file)
            }

        }
    }


    const TextField = (props) => <>
        <Typography variant="overline" display="block" gutterBottom color="primary">
            {props.label}
        </Typography>
        <MuiTextField
            fullWidth
            minRows={props.minRows || 4}
            variant={editMode ? "filled" : "standard"}
            InputProps={{
                readOnly: !editMode,
            }}
            {...props}
            label={null}
            name={props.name}
        />
    </>

    if (updating) {
        return <MainSkeleton />
    }

    return (
        <Box style={{ minHeight: "87vh", backgroundColor: "background.default" }}>
            <CardHeader
                avatar={
                    editMode ? <label htmlFor="contained-button-file">
                        <Input inputProps={{ accept: 'image/*' }} id="contained-button-file" type="file" sx={{ display: "none" }} onChange={handleFileSelected} />
                        <IconButton component="span" color="inherit">
                            <div style={{
                                width: "100px",
                                height: "100px",
                                position: "relative"
                            }}>
                                <Avatar
                                    src={logotype ? logotype.path : process.logotype_link}
                                    variant="rounded"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        position: "absolute"
                                    }}
                                />
                                <Edit style={{
                                    width: "50%",
                                    height: "50%",
                                    position: "absolute",
                                    top: "50%",
                                    transform: "translateY(-50%)"
                                }} />
                            </div>


                        </IconButton>
                    </label> : <Avatar
                        src={process.logotype_link}
                        variant="rounded"
                        style={{
                            margin: "10px",
                            width: "100px",
                            height: "100px",
                        }}
                    />
                }
                title={
                    <Stack justifyContent="center" spacing={1}>
                        <Typography variant="subtitle1"><b>{t("Created")}:</b> {moment(process.created_at).format("LL")}</Typography>
                        {process.updated_at && <Typography variant="subtitle1"><b>{t("Last update")}:</b> {moment(process.updated_at).format("LLL")}</Typography>}
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" disabled={editMode} color="primary" onClick={() => setEditMode(true)} startIcon={<Edit />}>{t("Edit coproduction process")}</Button>
                            <ConfirmationButton

                                    Actionator={({ onClick }) => <Button disabled={!editMode} variant="contained" color="error" onClick={onClick} startIcon={<Delete />}>{t("Remove coproduction process")}</Button>}
                                    ButtonComponent={({ onClick }) => <Button sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</Button>}
                                    onClick={onRemove}
                                    text={t("Are you sure?")}
                            />
                        </Stack>
                    </Stack>
                }
            />
            <Formik
                initialValues={{
                    name: process.name || "",
                    description: process.description || "",
                    organization: process.organization || "",
                    aim: process.aim || "",
                    idea: process.idea || "",
                    challenges: process.challenges || "",
                    submit: null
                }}
                validationSchema={Yup
                    .object()
                    .shape({
                        name: Yup.string().required(t('Required')),
                        /* description: Yup.string().required('required'),
                            aim: Yup.string().required('required'),
                            organization: Yup.string().required('required'),
                            idea: Yup.string().required('required'),
                            challenges: Yup.string().required('required'),*/

                    })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        console.log(values)
                        dispatch(updateProcess({
                            id: process.id,
                            data: values,
                            logotype,
                            onSuccess: () => {
                                if (mounted.current) {
                                    setEditMode(false)
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }

                            }
                        }))

                    } catch (err) {
                        console.error(err);
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    submitForm,
                    isSubmitting,
                    setFieldValue,
                    setFieldTouched,
                    resetForm,
                    touched,
                    isValid,
                    values
                }) => (
                    <Form>
                        <Grid container sx={{ width: "96%", ml: 2 }} direction="row" justifyContent="center" spacing={2} >
                            <Grid item xs={12}>
                                <TextField label={t("NAME OF THE PROJECT")} helperText={touched.name && errors.name} error={Boolean(touched.name && errors.name)} value={values.name} onBlur={handleBlur} onChange={handleChange} name="name" />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField minRows={8} label={t("SHORT DESCRIPTION OF THE PROJECT")} multiline helperText={touched.description && errors.description} error={Boolean(touched.description && errors.description)} value={values.description} onBlur={handleBlur} onChange={handleChange} name="description" />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField minRows={8} label={t("ACTUAL ORGANIZATION OF THE SERVICE")} multiline helperText={touched.organization && errors.organization} error={Boolean(touched.organization && errors.organization)} value={values.organization} onBlur={handleBlur} onChange={handleChange} name="organization" />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField minRows={8} label={t("AIM OF THE PROJECT")} multiline helperText={touched.aim && errors.aim} error={Boolean(touched.aim && errors.aim)} value={values.aim} onBlur={handleBlur} onChange={handleChange} name="aim" />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField minRows={8} label={t("IDEA OF SERVICE TO BE CO-DELIVERED")} multiline helperText={touched.idea && errors.idea} error={Boolean(touched.idea && errors.idea)} value={values.idea} onBlur={handleBlur} onChange={handleChange} name="idea" />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <TextField minRows={8} label={t("CHALLENGES OF THE PROJECT")} multiline helperText={touched.challenges && errors.challenges} error={Boolean(touched.challenges && errors.challenges)} value={values.challenges} onBlur={handleBlur} onChange={handleChange} name="challenges" />
                            </Grid>

                        </Grid>
                        {editMode && <Stack direction="row" spacing={2} sx={{ justifyContent: "center", mt: 3, mb: 2 }}>
                            <Button variant="contained" disabled={isSubmitting} color="warning" size="medium" startIcon={<Delete />} onClick={() => { setEditMode(false); resetForm(); setLogotype(null); }}>{t("Cancel")}</Button>
                            <Button variant="contained" disabled={isSubmitting} color="success" size="large" startIcon={<Save />} onClick={submitForm} disabled={!isValid}>{t("Save")}</Button>
                            
                        </Stack>}
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default SettingsTab