'''                                                                     
                                                      __             
 _____    __  __                ___ ___       __     /\_\     ___    
/\ '__`\ /\ \/\ \             /' __` __`\   /'__`\   \/\ \  /' _ `\  
\ \ \L\ \\ \ \_\ \            /\ \/\ \/\ \ /\ \L\.\_  \ \ \ /\ \/\ \ 
 \ \ ,__/ \/`____ \           \ \_\ \_\ \_\\ \__/.\_\  \ \_\\ \_\ \_\
  \ \ \/   `/___/> \  _______  \/_/\/_/\/_/ \/__/\/_/   \/_/ \/_/\/_/
   \ \_\      /\___/ /\______\                                       
    \/_/      \/__/  \/______/                                       

'''

# this is sample code for python script.
# if you want to use other python files, import here and functions export your javascript code.
import json
import math
from pyscript_engineers_web import set_g_values, get_g_values, requests_json
from pyscript_engineers_web import MidasAPI, Product

def HelloWorld():
	return (f'Hello World! this message is from def HelloWorld of PythonCode.py')

def ApiGet():
	values = json.loads(get_g_values())
	base_uri = values["g_base_uri"]
	res = requests_json.get(url=f'https://{base_uri}/health', headers={
		'Content-Type': 'application/json'
	})
	return json.dumps(res)

# Basic CRUD Sample
def py_db_create(item_name, items):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_create(item_name, json.loads(items)))

def py_db_create_item(item_name, item_id, item):
  civil = MidasAPI(Product.CIVIL, "KR")
  return json.dumps(civil.db_create_item(item_name, item_id, json.loads(item)))

def py_db_read(item_name):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_read(item_name))

def py_db_read_item(item_name, item_id):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_read_item(item_name, item_id))

def py_db_update(item_name, items):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_update(item_name, json.loads(items)))

def py_db_update_item(item_name, item_id, item):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_update_item(item_name, item_id, json.loads(item)))

def py_db_delete(item_name, item_id):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_delete(item_name, item_id))

'''
                            __                         __                                
                     __    /\ \__                     /\ \                               
 __  __  __   _ __  /\_\   \ \ ,_\     __             \ \ \___       __    _ __     __   
/\ \/\ \/\ \ /\`'__\\/\ \   \ \ \/   /'__`\            \ \  _ `\   /'__`\ /\`'__\ /'__`\ 
\ \ \_/ \_/ \\ \ \/  \ \ \   \ \ \_ /\  __/             \ \ \ \ \ /\  __/ \ \ \/ /\  __/ 
 \ \___x___/' \ \_\   \ \_\   \ \__\\ \____\             \ \_\ \_\\ \____\ \ \_\ \ \____\
  \/__//__/    \/_/    \/_/    \/__/ \/____/  _______     \/_/\/_/ \/____/  \/_/  \/____/
                                             /\______\                                   
                                             \/______/                                   
'''
# ↓↓↓↓↓↓↓↓↓↓↓↓ write a main logic here ↓↓↓↓↓↓↓↓↓↓↓↓

    # ==================================== Convert Period, value to aFUNC ================================== #
def to_aFUNC(period, value):
    # 결과 출력
    #print(period)
    #print(value)
    aFUNC = []
    for i in range(len(period)):
        PERIOD = period[i]
        VALUE = value[i]
        aFUNC.append({"PERIOD":PERIOD, "VALUE":VALUE})
    return aFUNC

    # ==================================== Ploting the Graph (Preview)================================== #
# def plot(period,value):
#     civilApp = MidasAPI(Product.CIVIL, "KR")
#     plt.plot(period,value)
#     plt.title("NZS1170.5 (2004)")
#     plt.xlabel("Period(sec)")
#     plt.ylabel("Spectral Data(g)")

#     plt.grid(True)


#     plt.show()

# ==================================== Gravity Value by Unit ================================== #
def UNIT_GET():
    civilApp = MidasAPI(Product.CIVIL, "KR")
    unit = civilApp.db_read("UNIT")
    #유닛에 따른 GRAV 값을 지정합니다.
    dist_unit = unit[1]['DIST']
    GRAV_const = 9.806
    if dist_unit == "M":
        GRAV_const = 9.806
    elif dist_unit == "CM":
        GRAV_const = 980.6
    elif dist_unit == "MM":
        GRAV_const = 9806
    elif dist_unit == "IN":
        GRAV_const = 386.063
    else:
        GRAV_const = 32.1719
    return GRAV_const

# ==================================== RS 입력 ================================== #

def SPFC_UPDATE(ID,name,GRAV, aFUNC):
    civilApp = MidasAPI(Product.CIVIL, "KR")
    data = {
        "NAME": name,
        "iTYPE": 1,
        "iMETHOD": 0,
        "SCALE": 1,
        "GRAV": GRAV,
        "DRATIO": 0.05,
        "STR": {
            "SPEC_CODE": "USER"
        },
        "aFUNC": aFUNC
    }
    civilApp.db_update_item("SPFC", ID, data)
    
    result_message = {"success":"Updating SPFC is completed"}
    return json.dumps(result_message)
    

# ============================================================
# SPECTRUM SHAPE — NZS 1170.5:2025 Eqs 3.2–3.5
# ============================================================

def Sa_T(p, PGA, Sa_s, Tc, Td):
    """
    Elastic spectral acceleration Sa(T) per NZS 1170.5:2025.
    parametric — PGA, Sa_s, Tc, Td come from Table 3.1/3.2 and differ per site class (I–VI) AND per location
    """
    if p == 0:
        return PGA
    elif p <= 0.1:
        # Linear interpolation from PGA up to Sa_s plateau
        return PGA + (p / 0.1) * (Sa_s - PGA)
    elif p <= Tc:
        # Flat acceleration plateau
        return Sa_s
    elif p <= Td:
        # Velocity-controlled decay
        return Sa_s * (Tc / p)
    else:
        # Displacement-controlled decay
        return Sa_s * (Tc / p) * math.sqrt(Td / p)


# ============================================================
# HORIZONTAL DESIGN SPECTRUM
# ============================================================

def NZ_input_2025(PGA, Sa_s, Tc, Td, mu, Sp, fault_dist, max_period):
    """
    Builds horizontal design spectrum Cd(T) and vertical Cv(T).
    Replaces NZ_input() from the 2004 plugin.

    Parameters
    ----------
    PGA         : Peak ground acceleration (g) — from Table 3.1/3.2 for chosen site class
    Sa_s        : Short-period spectral acceleration (g) — from Table 3.1/3.2
    Tc          : Spectral acceleration plateau corner period (s) — from Table 3.1/3.2
    Td          : Spectral velocity plateau corner period (s) — from Table 3.1/3.2
    mu          : Structural ductility factor μ (user input, default 1.0)
    Sp          : Structural performance factor (user input, default 0.7)
    fault_dist  : Distance from nearest major fault (km) — for vertical spectrum
    max_period  : Maximum period (s)

    Returns JSON with keys: period, value_h (horizontal), value_v (vertical)
    """
    p = 0.0
    per_list = []
    increment = max_period * 0.01
    while p <= max_period + 1e-9:
        per_list.append(round(p, 5))
        p += increment

    # Always include spectral corner points so kinks are never missed
    for key_T in [0.1, Tc, Td]:
        key_T = round(key_T, 5)
        if 0 < key_T < max_period:
            per_list.append(key_T)

    period = sorted(set(per_list))

    # --- kμ = μ for all site classes (Section 5.2.1.1) ---
    k_mu = mu

    # --- Horizontal: Cd(T) = Sa(T) * Sp / kμ  [Eq. 5.3] ---
    value_h = []
    for p in period:
        sa = Sa_T(p, PGA, Sa_s, Tc, Td)
        value_h.append(round(sa * Sp / k_mu, 6))

    # --- Vertical: Cv(T) = Sa(T), with 0.7× reduction if D ≤ 10 km ---
    near_fault = fault_dist <= 10.0
    value_v = []
    for p in period:
        sa = Sa_T(p, PGA, Sa_s, Tc, Td)
        value_v.append(round(0.7 * sa if near_fault else sa, 6))

    return json.dumps({
        "period":  period,
        "value_h": value_h,
        "value_v": value_v,
    })


# ============================================================
# MAIN ENTRY POINT
# ============================================================

def main_NZS1170_5_2025(
    func_name:   str,
    PGA:         float,   # from Table 3.1/3.2 for chosen location + site class
    Sa_s:        float,   # from Table 3.1/3.2
    Tc:          float,   # from Table 3.1/3.2
    Td:          float,   # from Table 3.1/3.2
    mu:          float,   # structural ductility factor μ
    Sp:          float,   # structural performance factor
    fault_dist:  float,   # distance from nearest major fault (km)
    max_period:  float,   # maximum period (s)
    direction:   str = "H",  # "H" = horizontal, "V" = vertical
):
    """
    Called by the React frontend via PyScript.

    direction: "H" writes horizontal Cd(T), "V" writes vertical Cv(T).
               Call twice (once per direction) to register both spectra in Midas.
    """
    # Compute both spectra
    inputs = json.loads(
        NZ_input_2025(PGA, Sa_s, Tc, Td, mu, Sp, fault_dist, max_period)
    )
    aPeriod = inputs["period"]
    aValue  = inputs["value_h"] if direction == "H" else inputs["value_v"]


    civilApp = MidasAPI(Product.CIVIL, "KR")
    ID       = civilApp.db_get_next_id("SPFC")
    name     = func_name
    aFUNC    = to_aFUNC(aPeriod, aValue)
    GRAV     = UNIT_GET()

    return SPFC_UPDATE(ID, name, GRAV, aFUNC)