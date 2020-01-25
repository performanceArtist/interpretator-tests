BEGIN

    BEGIN
        x := 2;
        a := x;
        b := 10 * a + 10 * x / 4;
        c := a - - b
    end;

    x := 11;
END.
